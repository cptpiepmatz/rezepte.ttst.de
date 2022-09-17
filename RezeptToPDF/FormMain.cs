using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using PdfSharp;
using PdfSharp.Drawing;
using PdfSharp.Drawing.Layout;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using RezeptToPDF.Extensions;


namespace RezeptToPDF
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private const int BORDER_LEFT = 20; // mm
        private const int BORDER_RIGHT = 20; // mm
        private const int BORDER_TOP = 15; // mm
        private const int BORDER_BOTTOM = 15; // mm
        private const double FONT_BASE_SIZE = 4.5;
        private const string FONT_NAME = "Calibri"; // "Courier New"; // "Tahoma";
        private const double TABLE_SPACE_HOR_MM = 5;
        private const double TABLE_SPACE_VER_MM = 0;
        private const string PAGE_MASK = "%page% / %pages%";
        private const string FOOTER_LINK = "rezepte.ttst.de";
        private const string FOOTER_PIC = "..\\favicon\\ms-icon-310x310.png";

        private string sRezeptFileName;
        private string sRezeptFilePath;
        private string sRezeptTitle;
        private string sResultatbild = "";
        private string sInspiration = "";
        private string sPdfFileName = "";

        private readonly List<string> listZutaten = new List<string>();
        private readonly List<string> listZubereitung = new List<string>();

        private bool firstActivation = true;

        private double dBorderLeft;
        private double dBorderRight;
        private double dBorderTop;
        private double dBorderBottom;
        private double dInnerWidth;
        private double dActPosTop;
        private bool bDebugMode = false;
        private XFont fontRegular = new XFont(FONT_NAME, FONT_BASE_SIZE);
        private double dFontRegularHeight;
        private List<XGraphics> gfxList = new List<XGraphics>();

        private enum Section { None, Resultatbild, Pdf, Inspiration, Zutaten, Zubereitung };

        private void AddMessage(string s)
        {
            if (textBoxMain.Text.Length > 0)
            {
                textBoxMain.AppendText(Environment.NewLine);
            }   
            
            textBoxMain.AppendText(s);
        }

        private string addImgPath(string fileName)
        {
            return
                sRezeptFilePath +
                "img" + Path.DirectorySeparatorChar +
                sRezeptTitle + Path.DirectorySeparatorChar +
                fileName;
        }

        private bool checkZutaten()
        {
            List<string> listError = new List<string>();

            for (int i = listZutaten.Count - 1; i >= 0; i--)
            {
                string[] items = listZutaten[i].Split(';');

                if (items.Length == 1 || items.Length == 3) continue;

                listError.Add(listZutaten[i]);
            }

            if (listError.Count > 0)
            {
                AddMessage("");
                AddMessage("In der Sektion [Zutatten] sind fehlerhafte Zeilen:");

                foreach (string line in listError)
                {
                    AddMessage(line);
                }

                AddMessage("Die Zeilen müssen ein oder drei durch Semikola getrennte Einträge haben.");
            }

            return listError.Count == 0;
        }

        private bool prepareZubereitung()
        {
            int i;
            string s;

            // Trim auf alle Zeilen.
            for (i = 0; i < listZubereitung.Count; i++)
            {
                s = listZubereitung[i];

                if (s == "") continue;

                // Leerzeichen und Tabs am Zeilenanfang entfernen
                s = System.Text.RegularExpressions.Regex.Replace(s, @"^\s+", "");

                // Leerzeichen und Tabs am Zeilenende entfernen
                s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+$", "");

                // Doppelte Leerzeichen und Tabs entfernen (einfache Leerzeichen 
                // werden wieder gegen einfache Leerzeichen getauscht.)
                s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+", " ");

                listZubereitung[i] = s;
            }

            // Leerzeilen am Anfang entfernen.
            while (listZubereitung.Count >= 0 && listZubereitung[0] == "")
            {
                listZubereitung.RemoveAt(0);
            }

            // Leerzeilen am Ende entfernen.
            while (listZubereitung.Count >= 0 && listZubereitung[listZubereitung.Count - 1] == "")
            {
                listZubereitung.RemoveAt(listZubereitung.Count - 1);
            }

            // Alle Bilder, die nicht gedruckt werden, gegen eine Leerzeile tauschen.
            for (i = 0; i < listZubereitung.Count; i++)
            {
                s = listZubereitung[i];

                if (!s.StartsWith("![")) continue;

                if (s.StartsWith("![!") && s.EndsWith(")"))
                {
                    // Ist das Bild vorhanden?
                    int lastPos = s.LastIndexOf('(');
                    int L = s.Length;

                    string fileName = s.Substring(lastPos + 1, L - lastPos - 2);
                    fileName = addImgPath(fileName);

                    if (!File.Exists(fileName))
                    {
                        AddMessage("");
                        AddMessage(s);
                        AddMessage(string.Format("Datei \"{0}\" nicht gefunden.", s));
                        return false;
                    }

                    int wmm = 0; // Width in mm
                    int pos = 3;

                    while (pos < L)
                    {
                        char c = s[pos];

                        if (c >= '0' && c <= '9')
                        {
                            wmm = (wmm * 10) + (int)c - (int)'0';
                            pos++;
                        }
                        else
                        {
                            break;
                        }
                    }

                    if (wmm == 0 || (s[pos] != 'c' && s[pos] != 'm') || s[pos + 1] != 'm')
                    {
                        AddMessage("");
                        AddMessage(s);
                        AddMessage(
                            "Nach \"![!\" wird die Breite des Bildes in \"mm\" oder \"cm\" " +
                            "erwartet, gefolgt von einem beliebigen Trennzeichen."
                            );
                        return false;
                    }

                    /* Bei der Prüfung braucht das nicht gemacht werden.
                        if (s[pos] == 'c')
                        {
                            wmm = wmm * 10; // cm in mm Konvertieren
                        }
                    */
                }
                else
                {
                    // fängt mit "![" an, aber nicht mit "![!", 
                    // so soll das Bild nicht gedruckt werden.
                    listZubereitung[i] = "";
                }
            }

            return true;
        }

        private void FormMain_Activated(object sender, EventArgs e)
        {
            if (!firstActivation) return;

            bDebugMode = (ModifierKeys & Keys.Shift) != 0;
            firstActivation = false;
            string[] args = Environment.GetCommandLineArgs();
            string s;

            if (args.Length < 2 || args.Length > 3)
            {
                AddMessage("Es muss eine Datei als Startparameter angegeben werden, optional den Parameter \"debug\".");
                return;
            }

            sRezeptFileName = args[1];
            AddMessage(sRezeptFileName);

            if (!File.Exists(sRezeptFileName))
            {
                AddMessage("");
                AddMessage("Datei aus Startparameter nicht gefunden");
                return;
            }

            if (!sRezeptFileName.EndsWith(".rezept.txt", StringComparison.CurrentCultureIgnoreCase))
            {
                AddMessage("");
                AddMessage("Der Dateiname muss mit \".rezept.txt\" enden.");
                return;
            }

            if (args.Length == 3)
            {
                if (args[2].Equals("debug", StringComparison.CurrentCultureIgnoreCase))
                {
                    bDebugMode = true;
                }
                else
                {
                    AddMessage("");
                    AddMessage("Der 3. optionale Parameter muss = \"debug\" sein.");
                    return;
                }
            }
                
            sRezeptFilePath = Path.GetDirectoryName(sRezeptFileName);

            if (sRezeptFilePath != "")
            {
                sRezeptFilePath += Path.DirectorySeparatorChar;
            }

            sRezeptFileName = Path.GetFileName(sRezeptFileName);
            sRezeptTitle = sRezeptFileName.Substring(0, sRezeptFileName.Length - 11); // .rezept.txt
            Text += " - " + sRezeptTitle;

            List<string> lines = new List<string>();
            lines.LoadFormFile(sRezeptFilePath + sRezeptFileName);

            Section actSection = Section.None;
            Array sections = Enum.GetValues(typeof(Section));
            int lineNr=0;
            int lineNrLen = (lines.Count + 1).ToString().Length;

            foreach (string line in lines)
            {
                lineNr++;
                AddMessage(lineNr.ToString().PadLeft(lineNrLen) + ": " + line);

                if (line == "" && actSection != Section.Zubereitung) continue;

                if (line.StartsWith("[") && line.EndsWith("]"))
                {
                    actSection = Section.None;
                    string sSection = line.Remove(line.Length - 1).Remove(0, 1);

                    foreach (Section section in sections)
                    {
                        if (!sSection.Equals(
                            section.ToString(),
                            StringComparison.CurrentCultureIgnoreCase)) continue;

                        actSection = section;
                        break;
                    }

                    if (actSection == Section.None)
                    {
                        s = string.Format("Sektion [{0}] ist ungültig.", sSection);
                        AddMessage("");
                        AddMessage(s);
                        return;
                    }
                }
                else
                {
                    switch (actSection)
                    {
                        case Section.Inspiration: 
                            if (sInspiration != "")
                            {
                                AddMessage("");
                                AddMessage("Die Sektion [Inspiration] darf nur einmal belegt werden.");
                                return;
                            }

                            sInspiration = line;
                            break;

                        case Section.Pdf:
                            if (sPdfFileName != "")
                            {
                                AddMessage("");
                                AddMessage("Die Sektion [PDF] darf nur einmal belegt werden.");
                                return;
                            }

                            sPdfFileName = line;

                            if (sPdfFileName.Contains(Path.DirectorySeparatorChar))
                            {
                                AddMessage("");
                                s = String.Format(
                                    "Der Dateiname darf kein \"{0}\" enthalten.",
                                    Path.DirectorySeparatorChar
                                    );
                                AddMessage(s);
                                return;
                            }

                            sPdfFileName = sRezeptFilePath + "pdf\\" + sPdfFileName;
                            break;

                        case Section.Resultatbild:
                            if (sResultatbild != "")
                            {
                                AddMessage("");
                                AddMessage("Die Sektion [Resultatbild] darf nur einmal belegt werden.");
                                return;
                            }

                            sResultatbild = line;

                            if (sResultatbild.Contains(Path.DirectorySeparatorChar))
                            {
                                AddMessage("");
                                s = String.Format(
                                    "Der Dateiname darf kein \"{0}\" enthalten.",
                                    Path.DirectorySeparatorChar
                                    );
                                AddMessage(s);
                                return;
                            }

                            s = addImgPath(sResultatbild);

                            if (!File.Exists(s))
                            {
                                AddMessage("");
                                AddMessage(string.Format("Datei \"{0}\" nicht gefunden.", s));
                                return;
                            }

                            break;

                        case Section.Zubereitung:
                            listZubereitung.Add(line);
                            break;

                        case Section.Zutaten:
                            listZutaten.Add(line);
                            break;
                    }
                }
            }

            if (sPdfFileName == "")
            {
                AddMessage("");
                AddMessage("Die Sektion [PDF] existiert nicht.");
                AddMessage("");
                AddMessage("Diese Vorlage kopieren und in die Rezeptdatei einfügen:");
                AddMessage("");
                AddMessage("[PDF]");
                AddMessage(sRezeptTitle + ".pdf");
                AddMessage("");
                return;
            }

            if (!checkZutaten()) return;            
            if (!prepareZubereitung()) return;

            CreatePDF();
        }

        private void DrawDebugMark(XGraphics gfx)
        {
            if (!bDebugMode) return;

            gfx.DrawRectangle(
                           XBrushes.Black,
                           dBorderLeft - 10,
                           dActPosTop,
                           10,
                           0.25
                       );

            string s = dActPosTop.ToString("#.0");

            XRect rectText = new XRect(
                dBorderLeft - 10,
                dActPosTop,
                8,
                gfx.MeasureString(s, fontRegular).Height
            );

            gfx.DrawString(
                            s,
                            fontRegular,
                            XBrushes.Black, rectText,
                            XStringFormats.CenterRight
                        );
        }

        private void CreateTitle(XGraphics gfx)
        {
            XFont font = new XFont(FONT_NAME, FONT_BASE_SIZE / 3 * 4, XFontStyle.Underline);
            double h = gfx.MeasureString(sRezeptTitle, font).Height;
            XRect rect = new XRect(dBorderLeft, dActPosTop, dInnerWidth, h);
            gfx.DrawString(sRezeptTitle, font, XBrushes.Black, rect, XStringFormats.Center);
            DrawDebugMark(gfx);
            dActPosTop += h * 2;
        }

        private string SolveFraq(string s)
        {
            s = s.Replace("1/2", ((char)0x00BD).ToString());
            s = s.Replace("1/3", ((char)0x2153).ToString());
            s = s.Replace("2/3", ((char)0x2154).ToString());
            s = s.Replace("1/4", ((char)0x00BC).ToString());
            s = s.Replace("2/4", ((char)0x00BD).ToString());
            s = s.Replace("3/4", ((char)0x00BE).ToString());
            s = s.Replace("1/5", ((char)0x2155).ToString());
            s = s.Replace("2/5", ((char)0x2156).ToString());
            s = s.Replace("3/5", ((char)0x2157).ToString());
            s = s.Replace("4/5", ((char)0x2158).ToString());
            s = s.Replace("1/6", ((char)0x2159).ToString());
            s = s.Replace("2/6", ((char)0x2153).ToString());
            s = s.Replace("3/6", ((char)0x00BD).ToString());
            s = s.Replace("4/6", ((char)0x2154).ToString());
            s = s.Replace("5/6", ((char)0x215A).ToString());
            s = s.Replace("1/7", ((char)0x2150).ToString());
            s = s.Replace("1/8", ((char)0x215B).ToString());
            s = s.Replace("2/8", ((char)0x00BC).ToString());
            s = s.Replace("3/8", ((char)0x215C).ToString());
            s = s.Replace("4/8", ((char)0x00BD).ToString());
            s = s.Replace("5/8", ((char)0x215D).ToString());
            s = s.Replace("6/8", ((char)0x00BE).ToString());
            s = s.Replace("7/8", ((char)0x215E).ToString());
            s = s.Replace("1/9", ((char)0x2151).ToString());
            s = s.Replace("1/10", ((char)0x2152).ToString());

            return s;
        }

        private void CreateZutaten(XGraphics gfx)
        {
            // Zeichensatz für den Zwischentexte
            XFont fontHeader = new XFont(FONT_NAME, FONT_BASE_SIZE, XFontStyle.Bold);

            double w; // Width
            double h = gfx.MeasureString("Wq", fontRegular).Height; // Height

            // Größte Breite der drei Spalten
            double[] widths = new double[] { 0, 0, 0 };

            foreach (string row in listZutaten)
            {
                string[] cells = SolveFraq(row).Split(';');

                if (cells.Length == 3)
                {
                    for (int i = 0; i < 3; i++)
                    {
                        w = gfx.MeasureString(cells[i], fontRegular).Width;

                        if (widths[i] < w)
                        {
                            widths[i] = w;
                        }
                    }
                }
            }

            double totalWidth = TABLE_SPACE_HOR_MM * 2;

            foreach (double width in widths)
            {
                totalWidth += width;
            }

            // X-Position der drei Spalten
            double[] xPoses = new double[3];
            // Die erste Spalte ist links am Rand, ...
            xPoses[0] = dBorderLeft + ((dInnerWidth - totalWidth) / 2);
            // ... die anderen beiden Spalten versetzt.
            for (int i = 0; i < 2; i++)
            {
                xPoses[i + 1] = xPoses[i] + widths[i] + TABLE_SPACE_HOR_MM;
            }

            // Texte ausgeben
            foreach (string row in listZutaten)
            {
                string[] cells = SolveFraq(row).Split(';');

                if (cells.Length == 3)
                {
                    // Menge, Einheit und Zutat
                    for (int i = 0; i < 3; i++)
                    {
                        w = gfx.MeasureString(cells[i], fontRegular).Width;
                        XRect rect = new XRect(xPoses[i], dActPosTop, widths[i], h);
                        gfx.DrawString(cells[i], fontRegular, XBrushes.Black, rect, XStringFormats.CenterLeft);
                    }

                    DrawDebugMark(gfx);
                }
                else
                {
                    // Zwischentext
                    w = gfx.MeasureString(cells[0], fontHeader).Width;
                    XRect rect = new XRect(xPoses[0], dActPosTop, w, h);
                    gfx.DrawString(cells[0], fontHeader, XBrushes.Black, rect, XStringFormats.CenterLeft);
                    DrawDebugMark(gfx);
                }

                dActPosTop += h + TABLE_SPACE_VER_MM;
            }
        }
        private void DrawTestFrame(XGraphics gfx)
        {
            if (!bDebugMode) return;

            string s = dBorderTop.ToString("#.0");
            double w = gfx.MeasureString(s, fontRegular).Width;
            
            XRect rectText = new XRect(
                dBorderLeft,
                dBorderTop - dFontRegularHeight,
                w,
                dFontRegularHeight
            );

            gfx.DrawString(
                            s,
                            fontRegular,
                            XBrushes.Black, rectText,
                            XStringFormats.CenterLeft
                        );

            s = dBorderBottom.ToString("#.0");
            w = gfx.MeasureString(s, fontRegular).Width;
            
            rectText = new XRect(
                dBorderLeft,
                dBorderBottom,
                w,
                dFontRegularHeight
            );

            gfx.DrawString(
                            s,
                            fontRegular,
                            XBrushes.Black, rectText,
                            XStringFormats.CenterLeft
                        );

            gfx.DrawRectangle(
                    XBrushes.Black,
                    dBorderLeft - 0.25,
                    dBorderTop - 0.25,
                    dBorderRight - dBorderLeft + 0.5,
                    0.25
                );

            gfx.DrawRectangle(
                    XBrushes.Black,
                    dBorderLeft - 0.25,
                    dBorderTop - 0.25,
                    0.25,
                    dBorderBottom - dBorderTop + 0.5
                );

            gfx.DrawRectangle(
                    XBrushes.Black,
                    dBorderRight,
                    dBorderTop - 0.25,
                    0.25,
                    dBorderBottom - dBorderTop + 0.5
                );

            gfx.DrawRectangle(
                    XBrushes.Black,
                    dBorderLeft - 0.25,
                    dBorderBottom,
                    dBorderRight - dBorderLeft + 0.5,
                    0.25
                );
        }

        private void CreateFooters(PdfDocument document)
        {
            for (int pageNr = 0; pageNr < gfxList.Count; pageNr++)
            {
                XGraphics gfx = gfxList[pageNr];
                double dLinkWidth = gfx.MeasureString(FOOTER_LINK, fontRegular).Width;
                XRect rect;

                if (File.Exists(sRezeptFilePath + FOOTER_PIC))
                {
                    XImage image = XImage.FromFile(sRezeptFilePath + FOOTER_PIC);
                    double dImageHeight = dFontRegularHeight;
                    double dImageWidth = dImageHeight * image.PixelWidth / image.PixelHeight;
                    double dImageLeft = dBorderLeft + ((dInnerWidth - dImageWidth - 5 - dLinkWidth) / 2);

                    rect = new XRect(
                        dImageLeft,
                        gfx.PageSize.Height - BORDER_BOTTOM - dImageHeight,
                        dImageWidth,
                        dImageHeight
                    );

                    gfx.DrawImage(image, rect);

                    rect = new XRect(
                        dImageLeft + dImageWidth + 5,
                        gfx.PageSize.Height - BORDER_BOTTOM - dFontRegularHeight,
                        dLinkWidth,
                        dFontRegularHeight
                    );
                }
                else
                {
                    rect = new XRect(
                        BORDER_LEFT + ((dInnerWidth - dLinkWidth) / 2),
                        gfx.PageSize.Height - BORDER_BOTTOM - dFontRegularHeight,
                        dLinkWidth,
                        dFontRegularHeight
                    );
                }
                               
                gfx.DrawString(FOOTER_LINK, fontRegular, XBrushes.Black, rect, XStringFormats.Center);

                if (gfxList.Count < 2) continue;

                // PAGE_MASK = "%page% / %pages%"
                string s = PAGE_MASK;
                s = s.Replace("%page%", (pageNr + 1).ToString());
                s = s.Replace("%pages%", gfxList.Count.ToString());

                rect = new XRect(
                        BORDER_LEFT,
                        gfx.PageSize.Height - BORDER_BOTTOM - dFontRegularHeight,
                        dInnerWidth,
                        dFontRegularHeight
                    );

                gfx.DrawString(s, fontRegular, XBrushes.Black, rect, XStringFormats.CenterRight);
            }
        }

        private void CreatePDF()
        {
            AddMessage("");
            AddMessage("Erstelle die PDF-Datei");

            PdfDocument document = new PdfDocument();
            document.Info.Title = sRezeptTitle;

            PdfPage page = document.AddPage();
            page.Size = PageSize.A4;

            XGraphics gfx = XGraphics.FromPdfPage(page, XGraphicsUnit.Millimeter);
            gfxList.Add(gfx);
            dFontRegularHeight = gfx.MeasureString("Wq", fontRegular).Height;

            dBorderLeft = BORDER_LEFT;
            dBorderRight = gfx.PageSize.Width - BORDER_RIGHT;
            dBorderTop = BORDER_TOP;
            dBorderBottom = gfx.PageSize.Height - BORDER_BOTTOM - (dFontRegularHeight * 2);

            DrawTestFrame(gfx);

            dInnerWidth = gfx.PageSize.Width - BORDER_LEFT - BORDER_RIGHT;
            dActPosTop = dBorderTop;

            CreateTitle(gfx);
            CreateZutaten(gfx);

            dActPosTop += 20; // 2 cm Platz

            PdfSharpMarkdown markDown = new PdfSharpMarkdown(gfx, FONT_NAME, FONT_BASE_SIZE, bDebugMode);
            markDown.ImgPath += MarkDown_ImgPath;
            markDown.SetText(listZubereitung);

            XRect rect = new XRect(dBorderLeft, dActPosTop, dInnerWidth, dBorderBottom - dActPosTop);
            markDown.Render(gfx, ref rect);
            
            while (!markDown.IsEmpty)
            {
                // Eine neue Seite anfangen
                page = document.AddPage();
                page.Size = PageSize.A4;

                gfx = XGraphics.FromPdfPage(page, XGraphicsUnit.Millimeter);
                gfxList.Add(gfx);
                DrawTestFrame(gfx);

                rect = new XRect(dBorderTop, dBorderTop, dInnerWidth, dBorderBottom - dBorderTop);
                if (!markDown.Render(gfx, ref rect)) break;
            }

            CreateFooters(document);

            // Save the document...
            AddMessage("");
            AddMessage("Speichere das Dokument");
            document.Save(sPdfFileName);
            
            // ...and start a viewer.
            Process.Start(sPdfFileName);

            AddMessage("Fertig");
            AddMessage("");
            AddMessage("Zur Ausgabe von Linien zur Fehlersuche beim Programmstart die ");
            AddMessage("Shift-Taste festhalten oder den Startparameter \"debug\" angeben.");
        }

        private string MarkDown_ImgPath(object sender, PdfSharpMarkdown.ImgPathEventArgs e)
        {
            return addImgPath(e.FileName);
        }

        private void FormMain_KeyPress(object sender, KeyPressEventArgs e)
        {

        }
    }
}
