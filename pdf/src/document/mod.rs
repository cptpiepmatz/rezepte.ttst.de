use std::ops::Deref;
use std::rc::Rc;
use genpdf::{Alignment, Context, Element, RenderResult};
use genpdf::elements::*;
use genpdf::error::Error;
use genpdf::render::Area;
use genpdf::style::{Style, StyledString};

mod ingredients;
pub use ingredients::*;

mod preparation;
pub use preparation::*;

mod footer;
pub use footer::*;

pub struct Title {
    title: Rc<String>
}

impl Title {
    pub fn new(title: Rc<String>) -> Self {
        Self {title}
    }
}

impl Element for Title {
    fn render(&mut self, context: &Context, area: Area<'_>, style: Style) -> Result<RenderResult, Error> {
        let mut style = Style::new().bold();
        style.set_font_size(style.font_size() + 12);
        let title = StyledString::new(self.title.deref(), style);
        let mut paragraph = Paragraph::new(title).aligned(Alignment::Center);
        let res = paragraph.render(context, area, style)?;
        Ok(RenderResult {
            size: (res.size.width, res.size.height + 4.into()).into(),
            has_more: false,
        })
    }
}
