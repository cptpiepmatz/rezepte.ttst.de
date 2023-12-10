use genpdf::elements::*;
use genpdf::error::Error;
use genpdf::render::Area;
use genpdf::style::{Style, StyledString};
use genpdf::{Context, Element, Margins, RenderResult};
use pulldown_cmark::Parser;
use std::mem;
use std::ops::Deref;
use std::rc::Rc;

pub struct Preparation {
    content: Rc<String>,
}

impl Preparation {
    pub fn new(content: Rc<String>) -> Self {
        Self { content }
    }
}

impl Element for Preparation {
    fn render(
        &mut self,
        context: &Context,
        mut area: Area<'_>,
        style: Style,
    ) -> Result<RenderResult, Error> {
        // TODO: scale down large recipes if needed

        let title_style = Style::new().bold().with_font_size(style.font_size() + 3);
        let title_string = StyledString::new(
            match self.content.is_empty() {
                false => "Zubereitung",
                true => "",
            },
            title_style,
        );
        let title_res = Text::new(title_string).render(context, area.clone(), style)?;
        area.add_offset((0, title_res.size.height + 2.into()));

        let margins = Margins::trbl(0, 0, 1, 0);
        let mut paragraphs = LinearLayout::vertical();
        let mut paragraph = Paragraph::default();
        let (mut strong, mut emphasis, mut heading) = (false, false, false);
        let mut is_image = false;
        let parser = Parser::new(self.content.deref());
        for event in parser {
            use pulldown_cmark::{Event as E, Tag as T};
            match event {
                E::Start(T::Strong) => strong = true,
                E::End(T::Strong) => strong = false,
                E::Start(T::Emphasis) => emphasis = true,
                E::End(T::Emphasis) => emphasis = false,
                E::Start(T::Heading(..)) => heading = true,
                E::End(T::Heading(..)) => {
                    heading = false;
                    paragraphs.push(mem::take(&mut paragraph));
                }

                E::Start(T::Image(..)) => {
                    paragraphs.push(PaddedElement::new(mem::take(&mut paragraph), margins));
                    is_image = true;
                }
                E::End(T::Image(..)) => {
                    is_image = false;
                }

                E::HardBreak => {
                    paragraphs.push(PaddedElement::new(mem::take(&mut paragraph), margins));
                }
                E::End(T::Paragraph) => {
                    paragraphs.push(PaddedElement::new(mem::take(&mut paragraph), margins));
                    paragraphs.push(Break::new(1));
                }

                E::Text(_) if is_image => (),
                E::Text(text) => {
                    let style = match (strong, emphasis, heading) {
                        // TODO: do more with a heading
                        (_, _, true) => Style::default()
                            .bold()
                            .with_font_size(style.font_size() + 1),
                        (false, false, _) => Style::default(),
                        (false, true, _) => Style::default().italic(),
                        (true, false, _) => Style::default().bold(),
                        (true, true, _) => Style::default().bold().italic(),
                    };

                    paragraph.push(StyledString::new(format!("{} ", text.trim()), style));
                }

                _ => (),
            }
        }

        paragraphs.render(context, area, style)
    }
}
