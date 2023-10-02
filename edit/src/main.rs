use include_dir::{Dir, include_dir};
use warp::{Filter, Reply};
use std::fs;
use std::ops::Deref;
use std::path::{PathBuf};
use std::sync::{Arc, Mutex};
use notify::{RecursiveMode, Watcher};
use clap::Parser;
use warp::path::{FullPath, Tail};

static WEB_DIR: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/web");

#[derive(Debug, Parser)]
struct Args {
    pub img_dir: PathBuf,
    pub recipe_file_path: PathBuf
}

#[tokio::main]
async fn main() {
    let Args {img_dir, recipe_file_path} = Args::parse();
    let img_dir = Arc::new(img_dir);
    let recipe_name = Arc::new(recipe_file_path.file_name().unwrap_or_else(|| panic!("{} is not a file path", recipe_file_path.display())).to_string_lossy().replace(".rezept.txt", ""));
    let recipe = Arc::new(Mutex::new(fs::read_to_string(&recipe_file_path).expect("could not read recipe file path")));
    let recipe_file_path = Arc::new(recipe_file_path);

    // Watch the file for changes
    let recipe_file_path_watch = recipe_file_path.clone();
    let recipe_watch = recipe.clone();
    let mut watcher = notify::recommended_watcher(move |_| {
        let mut recipe = recipe_watch.lock().expect("recip lock should work");
        *recipe = fs::read_to_string(recipe_file_path_watch.deref()).expect("could not read recipe file path");
    }).expect("could not create watcher");
    watcher.watch(recipe_file_path.deref(), RecursiveMode::NonRecursive).expect("could not watch recipe file path");

    // Route for "/"
    let index = warp::path::end()
        .map(|| warp::redirect(warp::http::Uri::from_static("/index.html")));

    // Route for "/name"
    let name_route = warp::path("name")
        .map(move || recipe_name.deref().clone());

    // Route for "/recipe"
    let recipe_route = warp::path("recipe")
        .map(move || {
            let recipe = recipe.lock().unwrap();
            recipe.clone()
        });

    let images = warp::path("_REZEPTE_").and(warp::path("img")).and(warp::path::tail()).map(move |tail: Tail| {
        let mut img_path = img_dir.deref().to_path_buf();
        img_path.push(tail.as_str());

        dbg!(&img_path);

        match fs::read(img_path) {
            Ok(bytes) => warp::reply::html(bytes).into_response(),
            Err(e) => warp::reply::with_status(e.to_string(), warp::http::StatusCode::INTERNAL_SERVER_ERROR).into_response()
        }
    });

    // Route for static files
    let static_files = warp::path::full()
        .map(|path: FullPath| {
            let filename = path.as_str().replacen('/', "", 1);
            dbg!(&filename);
            if let Some(file) = WEB_DIR.get_entry(&filename).and_then(|e| e.as_file()) {
                let contents = file.contents();

                use warp::reply::with_header;
                const CT: &str = "Content-Type";
                match PathBuf::from(filename).extension().expect("only serve file requests").to_string_lossy().as_ref() {
                    "wasm" => with_header(contents, CT, "application/wasm").into_response(),
                    "css" => with_header(contents, CT, "text/css").into_response(),
                    "svg" => with_header(contents, CT, "image/svg+xml").into_response(),
                    _ => warp::reply::html(contents).into_response()
                }
            } else {
                warp::reply::with_status("Not Found", warp::http::StatusCode::NOT_FOUND).into_response()
            }
        });


    // Combine all routes
    let routes = index.or(name_route).or(recipe_route).or(images).or(static_files);

    warp::serve(routes).run(([0, 0, 0, 0], 3000)).await;
}
