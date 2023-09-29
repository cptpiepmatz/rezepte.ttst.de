use crate::ext::Recipe;
use genpdf::{Document, PaperSize, SimplePageDecorator};
use std::io::Write;
use std::rc::Rc;
use utils::ErrToJS;
use wasm_bindgen::prelude::*;

mod document;
mod ext;
mod font;
mod utils;

#[cfg(test)]
mod test;

#[wasm_bindgen]
pub fn gen_recipe_pdf(ser_recipe: &str) -> Result<Vec<u8>, JsValue> {
    utils::set_panic_hook();

    let recipe: Recipe = serde_json::from_str(ser_recipe).into_js()?;
    let mut buffer: Vec<u8> = Vec::new();

    gen_recipe_pdf_impl(recipe, &mut buffer).into_js()?;
    Ok(buffer)
}

// TODO: make the error type useful
fn gen_recipe_pdf_impl(recipe: Recipe, w: impl Write) -> Result<(), genpdf::error::Error> {
    // log!("{:#?}", &recipe);
    let Recipe {
        name,
        ingredients,
        preparation,
        ..
    } = recipe;

    let name = name.unwrap_or("Rezept".to_string());
    let name = Rc::new(name);

    let ingredients = ingredients.unwrap_or_default();
    let ingredients = Rc::new(ingredients);

    let preparation = preparation.unwrap_or_default();
    let preparation = Rc::new(preparation);

    let font_family = font::init_font_family();
    let mut doc = Document::new(font_family);
    doc.set_paper_size(PaperSize::A4);
    doc.set_title(format!("{} | rezepte.ttst.de", &name));
    doc.set_font_size(14);

    let mut decorator = SimplePageDecorator::new();
    decorator.set_margins((8, 12));
    doc.set_page_decorator(decorator);

    doc.push(document::Title::new(name.clone()));
    doc.push(document::Ingredients::new(ingredients.clone()));
    doc.push(document::Preparation::new(preparation.clone()));
    doc.push(document::Footer::new(name.clone()));

    doc.render(w)
}
