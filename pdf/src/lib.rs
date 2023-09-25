use wasm_bindgen::prelude::*;

mod utils;
mod ext;

#[wasm_bindgen]
pub fn gen_recipe_pdf(ser_recipe: String) -> Vec<u8> {
    utils::set_panic_hook();
    todo!()
}
