use genpdf::fonts::{FontData, FontFamily};

const LIBERATION_SANS_REGULAR: &[u8] = include_bytes!("../../fonts/LiberationSans-Regular.ttf");
const LIBERATION_SANS_ITALIC: &[u8] = include_bytes!("../../fonts/LiberationSans-Italic.ttf");
const LIBERATION_SANS_BOLD: &[u8] = include_bytes!("../../fonts/LiberationSans-Bold.ttf");
const LIBERATION_SANS_BOLD_ITALIC: &[u8] =
    include_bytes!("../../fonts/LiberationSans-BoldItalic.ttf");

pub fn init_font_family() -> FontFamily<FontData> {
    let regular =
        FontData::new(LIBERATION_SANS_REGULAR.to_vec(), None).expect("to load regular font");
    let italic = FontData::new(LIBERATION_SANS_ITALIC.to_vec(), None).expect("to load italic font");
    let bold = FontData::new(LIBERATION_SANS_BOLD.to_vec(), None).expect("to load bold font");
    let bold_italic = FontData::new(LIBERATION_SANS_BOLD_ITALIC.to_vec(), None)
        .expect("to load bold italic font");

    FontFamily {
        regular,
        italic,
        bold,
        bold_italic,
    }
}
