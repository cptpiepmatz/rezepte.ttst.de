use crate::utils;
use fast_qr::convert::image::ImageBuilder;
use fast_qr::convert::Builder;
use fast_qr::QRBuilder;
use genpdf::elements::Image;
use genpdf::error::Error;
use genpdf::render::Area;
use genpdf::style::Style;
use genpdf::{Alignment, Context, Element, RenderResult};
use image::DynamicImage;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use std::ops::Deref;
use std::rc::Rc;

static LOGO_PNG: &[u8] = include_bytes!("../../../logo/logo.png");

pub struct Footer {
    name: Rc<String>,
}

impl Footer {
    pub fn new(name: Rc<String>) -> Self {
        Self { name }
    }
}

impl Element for Footer {
    fn render(
        &mut self,
        context: &Context,
        area: Area<'_>,
        style: Style,
    ) -> Result<RenderResult, Error> {
        let encoded_name = utf8_percent_encode(self.name.deref(), NON_ALPHANUMERIC);
        let link = format!("https://rezepte.ttst.de/?recipe={encoded_name}");

        let logo = utils::remove_alpha_channel(LOGO_PNG).expect("is valid RGBA PNG");
        let logo = DynamicImage::ImageRgb8(logo);
        let mut logo = Image::from_dynamic_image(logo).expect("is image");
        logo.set_alignment(Alignment::Left);
        let mut logo_area = area.clone();
        logo_area.add_offset((0, area.size().height - 19.into()));
        let _ = logo.render(context, logo_area, style);

        let qr = QRBuilder::new(link).build().expect("valid qr code");
        let qr_img = ImageBuilder::default()
            .background_color("#FFFFFF")
            .fit_height(250)
            .to_bytes(&qr)
            .expect("rendering should work");
        let qr_img = utils::remove_alpha_channel(&qr_img).expect("is valid RGBA PNG");
        let qr_img = DynamicImage::ImageRgb8(qr_img);
        let mut qr_img = Image::from_dynamic_image(qr_img).expect("is image");
        qr_img.set_alignment(Alignment::Right);
        let mut qr_area = area.clone();
        qr_area.add_offset((0, area.size().height - 20.into()));
        let _ = qr_img.render(context, qr_area, style);

        Ok(RenderResult {
            size: area.size(),
            has_more: false,
        })
    }
}
