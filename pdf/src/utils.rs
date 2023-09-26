use std::fmt::Display;
use wasm_bindgen::JsValue;

pub trait ErrToJS {
    type Ok;

    fn into_js(self) -> Result<Self::Ok, JsValue>;
}

impl<T, E> ErrToJS for Result<T, E>
where
    E: Display,
{
    type Ok = T;

    fn into_js(self) -> Result<T, JsValue> {
        match self {
            Ok(v) => Ok(v),
            Err(e) => Err(format!("{e}").into()),
        }
    }
}

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub mod console {
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        pub fn log(s: &str);
    }
}

macro_rules! log {
    ($($arg:tt)*) => {{
        let formatted = format!($($arg)*);
        println!("{}", formatted);
        #[cfg(target_arch = "wasm32")]
        $crate::utils::console::log(&formatted);
    }};
}

pub(crate) use log;
