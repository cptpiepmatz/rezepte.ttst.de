use crate::ext::{Ingredient, INGREDIENTS_GENERAL};
use crate::utils::FractionDisplay;
use genpdf::elements::*;
use genpdf::error::Error;
use genpdf::render::Area;
use genpdf::style::{Style, StyledString};
use genpdf::{Context, Element, RenderResult};
use indexmap::IndexMap;
use std::fmt::Write;
use std::rc::Rc;

pub struct Ingredients {
    map: Rc<IndexMap<String, Vec<Ingredient>>>,
}

impl Ingredients {
    pub fn new(map: Rc<IndexMap<String, Vec<Ingredient>>>) -> Self {
        Self { map }
    }
}

impl Element for Ingredients {
    fn render(
        &mut self,
        context: &Context,
        mut area: Area<'_>,
        style: Style,
    ) -> Result<RenderResult, Error> {
        let title_style = Style::new().bold().with_font_size(style.font_size() + 3);
        let title_string = StyledString::new("Zutaten", title_style);
        let title_res = Text::new(title_string).render(context, area.clone(), style)?;
        let title_offset = title_res.size.height + 2.into();
        area.add_offset((0, title_offset));

        let mut max_section_height = 0.into();
        let mut process_section = |section: &mut IngredientsSection| -> Result<_, _> {
            let res = section.render(context, area.clone(), style)?;
            max_section_height = res.size.height.max(max_section_height);
            area.add_offset((res.size.width, 0));
            Ok(())
        };

        for mut section in self
            .map
            .iter()
            .map(|(name, elements)| IngredientsSection { name, elements })
        {
            if section.elements.len() > 10 {
                let split = section.elements.len() / 2;
                let first = &section.elements[0..=split];
                let second = &section.elements[split+1..];

                for elements in [first, second] {
                    let mut section = IngredientsSection {
                        name: section.name,
                        elements
                    };
                    process_section(&mut section)?;
                }

                continue;
            }

            process_section(&mut section)?;
        }

        let offset = title_offset + max_section_height + 6.into();

        Ok(RenderResult {
            size: (area.size().width, offset).into(),
            has_more: false,
        })
    }
}

pub struct IngredientsSection<'i> {
    name: &'i str,
    elements: &'i [Ingredient],
}

impl<'i> Element for IngredientsSection<'i> {
    fn render(
        &mut self,
        context: &Context,
        mut area: Area<'_>,
        style: Style,
    ) -> Result<RenderResult, Error> {
        let mut title_height = 0.into();
        if self.name != INGREDIENTS_GENERAL {
            let title_style = Style::new().bold();
            let title_string = StyledString::new(self.name, title_style);
            let title_res = Text::new(title_string).render(context, area.clone(), style)?;
            title_height = title_res.size.height;
            area.add_offset((0, title_res.size.height));
        }

        let mut list = UnorderedList::with_bullet("•");
        for Ingredient {
            amount,
            unit,
            description,
        } in self.elements
        {
            let mut line = String::new();

            if let Some(amount) = amount.as_ref() {
                let amount = FractionDisplay::from(*amount);
                write!(line, "{amount} ").expect("infallible");
            }
            if let Some(unit) = unit.as_ref() {
                write!(line, "{unit} ").expect("infallible");
            }
            if let Some(description) = description.as_ref() {
                write!(line, "{description}").expect("infallible");
            }

            list.push(Paragraph::new(line));
        }

        area.add_offset((-5, 0));
        let list_res = list.render(context, area, style)?;

        Ok(RenderResult {
            size: (list_res.size.width, list_res.size.height + title_height).into(),
            has_more: false,
        })
    }
}
