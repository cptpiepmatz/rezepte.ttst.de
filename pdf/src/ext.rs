use serde::Deserialize;
use indexmap::IndexMap;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recipe {
    pub name: Option<String>,
    pub result_image: Option<String>,
    pub ingredients: Option<IndexMap<String, Vec<Ingredient>>>,
    pub preparation: Option<String>,
    pub pdf: Option<String>,
    pub inspiration: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Ingredient {
    pub amount: Option<f64>,
    pub unit: Option<String>,
    pub description: Option<String>,
}
