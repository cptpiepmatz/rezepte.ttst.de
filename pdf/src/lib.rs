use crate::ext::Recipe;
use crate::utils::log;
use std::io::Write;
use utils::ErrToJS;
use wasm_bindgen::prelude::*;

mod ext;
mod utils;

#[cfg(test)]
mod test;

#[wasm_bindgen]
pub fn gen_recipe_pdf(ser_recipe: &str) -> Result<Vec<u8>, JsValue> {
    utils::set_panic_hook();

    let recipe: Recipe = serde_json::from_str(ser_recipe).into_js()?;
    let mut buffer: Vec<u8> = Vec::new();

    // TODO: handle this in the future
    let _ = gen_recipe_pdf_impl(recipe, &mut buffer);

    Ok(buffer)
}

// TODO: make the error type useful
fn gen_recipe_pdf_impl(recipe: Recipe, w: impl Write) -> Result<(), ()> {
    log!("{:#?}", &recipe);
    todo!()
}
