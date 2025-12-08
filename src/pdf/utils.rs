use std::fmt;
use std::fmt::{Display, Formatter};

use image::{GenericImageView, ImageResult, Rgb, RgbImage};
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

pub fn remove_alpha_channel(rgba: &[u8]) -> ImageResult<RgbImage> {
    let dyn_img = image::load_from_memory(rgba)?;
    let (height, width) = (dyn_img.height(), dyn_img.width());
    let mut rgb = RgbImage::new(width, height);

    for x in 0..width {
        for y in 0..height {
            let rgba_pixel = dyn_img.get_pixel(x, y).0;
            let (r, g, b, a) = (
                rgba_pixel[0] as f32,
                rgba_pixel[1] as f32,
                rgba_pixel[2] as f32,
                rgba_pixel[3] as f32,
            );
            let w = 255.0;
            let r = r * (a / 255.0) + w * (1.0 - a / 255.0);
            let g = g * (a / 255.0) + w * (1.0 - a / 255.0);
            let b = b * (a / 255.0) + w * (1.0 - a / 255.0);
            let rgb_pixel = Rgb([r as u8, g as u8, b as u8]);
            rgb.put_pixel(x, y, rgb_pixel);
        }
    }

    Ok(rgb)
}

pub struct FractionDisplay(f64);

impl<F> From<F> for FractionDisplay
where
    F: Into<f64>,
{
    fn from(value: F) -> Self {
        Self(value.into())
    }
}

impl Display for FractionDisplay {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let eps = 1e-6;
        let num = self.0;

        let int = num.trunc() as i64;
        let frac = num.fract();

        let frac_display = match frac.abs() {
            _ if frac.abs() < eps => Some(""),
            // The other fractions are not available in the font
            _ if (frac - (1.0 / 2.0)).abs() < eps => Some("½"),
            // _ if (frac - (1.0 / 3.0)).abs() < eps => Some("⅓"),
            _ if (frac - (1.0 / 4.0)).abs() < eps => Some("¼"),
            // _ if (frac - (1.0 / 5.0)).abs() < eps => Some("⅕"),
            // _ if (frac - (1.0 / 6.0)).abs() < eps => Some("⅙"),
            _ if (frac - (1.0 / 8.0)).abs() < eps => Some("⅛"),
            // _ if (frac - (2.0 / 3.0)).abs() < eps => Some("⅔"),
            _ if (frac - (3.0 / 4.0)).abs() < eps => Some("¾"),
            // _ if (frac - (4.0 / 5.0)).abs() < eps => Some("⅘"),
            // _ if (frac - (5.0 / 6.0)).abs() < eps => Some("⅚"),
            _ if (frac - (7.0 / 8.0)).abs() < eps => Some("⅞"),
            _ => None,
        };

        match (int, frac_display) {
            (0, Some(frac_display)) => write!(f, "{frac_display}"),
            (_, Some(frac_display)) => write!(f, "{int}{frac_display}"),
            (_, None) => write!(f, "{}", format!("{num:.1}").replace('.', ",")),
        }
    }
}
