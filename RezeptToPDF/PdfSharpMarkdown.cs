using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PdfSharp.Drawing;
using RezeptToPDF.Extensions;

namespace RezeptToPDF
{
    public class PdfSharpMarkdown
    {
        public class ImgPathEventArgs : EventArgs
        {
            public readonly string FileName;

            public ImgPathEventArgs(string fileName)
            {
                FileName = fileName;
            }
        }

        public delegate string ImgPathEventHandler(object sender, ImgPathEventArgs e);

        public enum FontStyle 
        { 
            // 2^0 - Bold, 2^1 - Italic, 2^2 - StrikeOut
            Regular,            // 0
            Bold,               // 1
            Italic,             // 2
            BoldItalic,         // 3
            StrikeOut,          // 4
            BoldStrikeOut,      // 5
            ItalicStrikeOut,    // 6
            BoldItalicStrikeOut // 7
        }

        public enum FontStyles
        {
            Regular = 0,
            BoldStar = 1,
            BoldULine = 2,
            ItalicStar = 4,
            ItalicULine = 8,
            StrikeOut = 16,
            AllBoldAndItalic = 32
            /*
                Bold             ** ** or __ __
                Italic           * * or _ _
                StrikeOut        ~~ ~~
                BoldAndItalic    ** ** and _ _
                AllBoldAndItalic *** ***
            */
        }

        public class BlockBase {}

        public class BlockText : BlockBase
        {
            public string Text;
            public readonly FontStyle Style;

            private char ConvertName(string s, int pos, ref int oldPos)
            {
                // Nun dürfen nur a-z, A-Z, 0-9 und "_" folgen
                int pos2 = pos + 1;
                char c;

                while (pos2 >= 0 && pos2 < s.Length - 1)
                {
                    c = s[pos2];

                    if (
                            (c >= 'a' && c <= 'z') ||
                            (c >= 'A' && c <= 'Z') ||
                            (c >= '0' && c <= '9') ||
                            (c == '_')
                        )
                    {
                        pos2++;
                    }
                    else
                    {
                        break;
                    }
                }

                // In der aufrufenden Funktion wird "oldPos++;" ausgeführt.
                if (pos2 < s.Length && s[pos2] == ';')
                {
                    string name = s.Substring(pos + 1, pos2 - pos - 1).ToLower();

                    switch (name)
                    {
                        // pos2 steht auf ";"
                        case ("nbsp"): oldPos = pos2; return (char)0160; // geschütztes Leerzeichen
                        case ("amp"): oldPos = pos2; return '&';
                        case ("lt"): oldPos = pos2; return '<';
                        case ("gt"): oldPos = pos2; return '>';
                        default: return '&';
                    }
                }
                else
                {
                    // "&nbsp" endet nicht mit ";", also nur "&" übernehmen und weiter.
                    return '&';
                }
            }

            private char ConvertDecimal(string s, int pos, ref int oldPos)
            {
                // Nun dürfen nur 0-9 folgen
                int pos2 = pos + 1;
                int code = 0;
                char c;

                while (pos2 >= 0 && pos2 < s.Length - 1)
                {
                    c = s[pos2];

                    if (c >= '0' && c <= '9')
                    {
                        code *= 10;
                        code += (int)c;
                        code -= (int)'0';
                        pos2++;
                    }
                    else
                    {
                        break;
                    }
                }

                // In der aufrufenden Funktion wird "oldPos++;" ausgeführt.
                if (pos2 < s.Length && s[pos2] == ';')
                {
                    // pos2 steht auf ";"
                    oldPos = pos2;
                    return (char)code;
                }
                else
                {
                    return '&';
                }
            }

            private char ConvertHexadecimal(string s, int pos, ref int oldPos)
            {
                // Nun dürfen nur a-f, A-F und 0-9 folgen
                int pos2 = pos + 3; // "#x" überspringen
                int code = 0;
                char c;

                while (pos2 >= 0 && pos2 < s.Length - 1)
                {
                    c = s[pos2];

                    if (c >= '0' && c <= '9')
                    {
                        code *= 16;
                        code += (int)c;
                        code -= (int)'0';
                        pos2++;
                    }
                    else if (c >= 'a' && c <= 'f')
                    {
                        code *= 16;
                        code += (int)c;
                        code -= (int)'a';
                        code += 10;
                        pos2++;
                    }
                    else if (c >= 'A' && c <= 'F')
                    {
                        code *= 16;
                        code += (int)c;
                        code -= (int)'A';
                        code += 10;
                        pos2++;
                    }
                    else
                    {
                        break;
                    }
                }

                // In der aufrufenden Funktion wird "oldPos++;" ausgeführt.
                if (pos2 < s.Length && s[pos2] == ';')
                {
                    // pos2 steht auf ";"
                    oldPos = pos2;
                    return (char)code;
                }
                else
                {
                    return '&';
                }
            }

            public BlockText(string s, FontStyle style)
            {
                int pos = s.IndexOf('&');

                // Die kürzeste Form an Zeichen sind z. B. "&gt;", "&#9;" (was sinnfrei ist).
                // Wenn hinter dem "&" keine weiteren 3 Zeichen mehr sind, braucht man auch nicht
                // weiter prüfen. So kann man einige Indexfehler umgehen.
                if (pos >= 0 && pos < s.Length - 3)
                {
                    StringBuilder sb = new StringBuilder();
                    int oldPos = 0;

                    // Die Abfrage "pos < s.Length - 1" schützt vor einem Indexfehler
                    while (pos >= 0 && pos < s.Length - 3)
                    {
                        // Den Text bis zur jetzigen Position übernehmen.
                        if (pos > oldPos)
                        {
                            sb.Append(s.Substring(oldPos, pos - oldPos));
                            oldPos = pos;
                        }

                        // Hier kann nur pos = oldPos sein und zeigt auf "&"

                        // dit & dat
                        // &nbsp;
                        // &#8208;
                        // &#x2010;
                        char c = s[pos + 1];
                
                        if (c == '#')
                        {
                            // &#8208;
                            // &#x2010;
                            if (s[pos + 2] == 'x')
                            {
                                // &#x2010;
                                c = ConvertHexadecimal(s, pos, ref oldPos);
                            }
                            else
                            {
                                // &#8208;
                                c = ConvertDecimal(s, pos, ref oldPos);
                            }

                        }
                        else
                        {
                            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
                            {
                                // &nbsp;
                                c = ConvertName(s, pos, ref oldPos);                                
                            }
                            else
                            {
                                // dit & dat
                                c = '&';
                            }
                        }

                        sb.Append(c);
                        oldPos++;
                        pos = s.IndexOf('&', oldPos);
                    }

                    if (oldPos < s.Length)
                    {
                        sb.Append(s.Substring(oldPos));
                    }

                    s = sb.ToString();
                }

                Text = s;
                Style = style;
            }

            public override string ToString()
            {
                return Style.ToString() + " - \"" + Text + "\"";
            }
        }

        public class BlockEmptyLine : BlockBase
        {
            public override string ToString()
            {
                return "EmptyLine";
            }
        }

        public class BlockHeadline : BlockBase
        {
            public readonly string HeadLine;
            public readonly int Level = 0;

            public BlockHeadline(string s)
            {
                while (s.StartsWith("#"))
                {
                    Level++;
                    s = s.Remove(0, 1);
                }

                HeadLine = s.Trim();

                if (Level > 6) Level = 6;
            }

            public override string ToString()
            {
                return HeadLine;
            }
        }

        public class BlockImage : BlockBase
        {
            public readonly string FileName;
            public readonly double Wmm; // Width in mm
            public readonly double Hmm; // Height in mm
            public readonly XImage Image;

            public BlockImage(string fileName, int wmm)
            {
                FileName = fileName;
                Wmm = wmm;
                Image = XImage.FromFile(fileName);
                Hmm = Wmm * Image.PixelHeight / Image.PixelWidth;
            }

            public override string ToString()
            {
                return "Image: \"" + FileName + "\"";
            }
        }

        private readonly List<BlockBase> blocks = new List<BlockBase>();
        private XGraphics gfx;
        private readonly XFont[] fontHeadline = new XFont[6];
        private Dictionary<FontStyle, XFont> fonts = new Dictionary<FontStyle, XFont>();
        private readonly List<string> text = new List<string>();
        private XRect rect;
        private double dActLeft;
        private double dActTop;
        private double dFontHeight;
        private bool bDebugMode = false;

        public string BreakAbleSigns { get; set; } = " ,.-";
        public event ImgPathEventHandler ImgPath;

        public PdfSharpMarkdown(XGraphics gfx, string fontName, double fontBaseSize, bool bDebugMode)
        {
            double factor = 1.0;

            for (int i = 0; i < 6; i++)
            {
                fontHeadline[i] = new XFont(fontName, fontBaseSize * factor, XFontStyle.Bold);
                factor += 0.2;
            }

            foreach (FontStyle style in (FontStyle[])Enum.GetValues(typeof(FontStyle)))
            {
                XFontStyle xstyle = XFontStyle.Regular;

                if ((style & FontStyle.Bold) > 0)
                {
                    xstyle |= XFontStyle.Bold;
                }

                if ((style & FontStyle.Italic) > 0)
                {
                    xstyle |= XFontStyle.Italic;
                }

                if ((style & FontStyle.StrikeOut) > 0)
                {
                    xstyle |= XFontStyle.Strikeout;
                }

                fonts[style] = new XFont(fontName, fontBaseSize, xstyle);
            }

            dFontHeight = gfx.MeasureString("Wq", fonts[FontStyle.Regular]).Height;
            this.bDebugMode = bDebugMode;
        }

        private bool IsLineBreak(string s)
        {
            if (s == "") return true;

            switch (s[0])
            {
                case '#': return true;

                case '!':
                    return s.StartsWith("![!");
            }

            return false;
        }

        private void JoinLines()
        {
            int i = 0;

            while (i < text.Count && IsLineBreak(text[i])) i++;

            // Jetzt alle Zeilen aneinanderhängen, bis zu einer 
            // Leerzeile, einem Bildlink oder einer Überschrift("#"). 
            while (i < text.Count) // Nur bis zur vorletzten Zeile prüfen.
            {
                if (IsLineBreak(text[i]))
                {
                    i++;
                }
                else
                {
                    if (i < text.Count - 1)
                    {
                        while (i < text.Count - 1)
                        {
                            if (IsLineBreak(text[i]))
                            {
                                i++;
                            }
                            else if (!IsLineBreak(text[i + 1]))
                            {
                                text[i] += " ";
                                text[i] += text[i + 1];
                                text.RemoveAt(i + 1);
                            }
                            else
                            {
                                i++;
                            }
                        }
                    }
                    else
                    {
                        i++;
                    }
                }
            }
        }

        private void Remove_br_()
        {
            int i = 0;

            while (i < text.Count)
            {
                string s = text[i];
                int pos = s.IndexOf("<br>", StringComparison.CurrentCultureIgnoreCase);

                if (pos >= 0 && !s.StartsWith("#")) // Wenn die Zeile mit "#" beginnt, ist das ein Titel.
                {
                    s = s.Substring(pos + 4);

                    if (s != "")
                    {
                        text.Insert(i + 1, s);
                    }

                    text.Insert(i + 1, "");
                    text[i] = text[i].Remove(pos);
                }

                i++;
            }
        }

        private void AddBlockEmptyLine()
        {
            blocks.Add(new BlockEmptyLine());
        }

        private void AddBlockHeadline(string s)
        {
            blocks.Add(new BlockHeadline(s));
        }

        private void AddBlockImage(string s)
        {
            // fäng mit "![" an
            if (!s.StartsWith("![!"))
            {
                // Das Bild soll nicht gedruckt werden.
                return;
            }

            // ![!10cm verrührter Teig](Teig.jpg)
            string fileName = s.GetTextInside('(', ')');

            if (ImgPath != null)
            {
                fileName = ImgPath(this, new ImgPathEventArgs(fileName));
            }

            int L = s.Length;
            int wmm = 0; // Width in mm
            int pos = 3;
            char c = ' ';

            while (pos < L)
            {
                c = s[pos];

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

            if (wmm == 0 || (c != 'c' && c != 'm')) return;

            if (c == 'c')
            {
                wmm *= 10; // cm in mm Konvertieren
            }

            pos++;

            if (s[pos] != 'm') return;

            blocks.Add(new BlockImage(fileName, wmm));
        }

        private bool IsStylesChangedByStar(
            string s,
            int pos,
            ref int newPos,
            FontStyles styles,
            ref FontStyles newStyles)
        {
            newPos = pos + 1;
            newStyles = styles;
            /*
                Bold             ** ** or __ __
                Italic           * * or _ _
                BoldAndItalic    ** ** and _ _
                AllBoldAndItalic *** ***

                None = 0,
                BoldStar = 1,
                BoldULine = 2,
                ItalicStar = 4,
                ItalicULine = 8,
                StrikeOut = 16,
                AllBoldAndItalic = 32
            */
            if (s.Substring(pos, 3).Equals("***"))
            {
                FontStyles boldItalicStrikeOut = FontStyles.StrikeOut | FontStyles.AllBoldAndItalic;
                newPos = pos + 3;

                if ((styles | boldItalicStrikeOut) == boldItalicStrikeOut)
                {
                    // AllBoldAndItalic und StrikeOut dürfen gesetzt sein, sonst nichts.
                    newStyles = styles ^ FontStyles.AllBoldAndItalic;
                    return true;
                }
                else
                {
                    // Es ist etwas anderes schon eingeleitet worden.
                    return false;
                }
            }

            if (s.Substring(pos, 2).Equals("**"))
            {
                FontStyles boldStarStrikeOut = FontStyles.StrikeOut | FontStyles.BoldStar;
                newPos = pos + 2;

                if ((styles | boldStarStrikeOut) == boldStarStrikeOut)
                {
                    // BoldStar und StrikeOut dürfen gesetzt sein, sonst nichts.
                    newStyles = styles ^ FontStyles.BoldStar;
                    return true;
                }
                else
                {
                    // Es ist etwas anderes schon eingeleitet worden.
                    return false;
                }
            }

            if (s.Substring(pos, 3).Equals("* *"))
            {
                FontStyles italicStarStrikeOut = FontStyles.StrikeOut | FontStyles.ItalicStar;
                newPos = pos + 3;

                if ((styles | italicStarStrikeOut) == italicStarStrikeOut)
                {
                    // ItalicStar und StrikeOut dürfen gesetzt sein, sonst nichts.
                    newStyles = styles ^ FontStyles.ItalicStar;
                    return true;
                }
                else
                {
                    // Es ist etwas anderes schon eingeleitet worden.
                    return false;
                }
            }

            return false;
        }

        private bool IsStylesChangedByULine(
            string s,
            int pos,
            ref int newPos,
            FontStyles styles,
            ref FontStyles newStyles)
        {
            /*
                Bold             ** ** or __ __
                Italic           * * or _ _
                BoldAndItalic    ** ** and _ _
                AllBoldAndItalic *** ***

                None = 0,
                BoldStar = 1,
                BoldULine = 2,
                ItalicStar = 4,
                ItalicULine = 8,
                StrikeOut = 16,
                AllBoldAndItalic = 32
            */
            if (s.Substring(pos, 3).Equals("_ _"))
            {
                FontStyles uLineItalicStrikeOut = FontStyles.StrikeOut | FontStyles.ItalicULine;
                newPos = pos + 3;

                if ((styles | uLineItalicStrikeOut) == uLineItalicStrikeOut)
                {
                    // ItalicULine und StrikeOut dürfen gesetzt sein, sonst nichts.
                    newStyles = styles ^ FontStyles.ItalicULine;
                    return true;
                }
                else
                {
                    // Es ist etwas anderes schon eingeleitet worden.
                    return false;
                }
            }

            if (s.Substring(pos, 2).Equals("__"))
            {
                FontStyles boldULineStrikeOut = FontStyles.StrikeOut | FontStyles.BoldULine;
                newPos = pos + 2;

                if ((styles | boldULineStrikeOut) == boldULineStrikeOut)
                {
                    // BoldULine und StrikeOut dürfen gesetzt sein, sonst nichts.
                    newStyles = styles ^ FontStyles.BoldULine;
                    return true;
                }
                else
                {
                    // Es ist etwas anderes schon eingeleitet worden.
                    return false;
                }
            }

            newPos = pos + 1;
            newStyles = styles;

            FontStyles italicULineStrikeOut = FontStyles.StrikeOut | FontStyles.BoldStar | FontStyles.ItalicULine;
            FontStyles boldStarItalicULineStrikeOut = FontStyles.StrikeOut | FontStyles.BoldStar | FontStyles.ItalicULine;
            
            if ((styles | italicULineStrikeOut) == boldStarItalicULineStrikeOut)
            {
                // BoldStar muss, ItalicULine und StrikeOut dürfen gesetzt sein, sonst nichts.
                newStyles = styles ^ FontStyles.ItalicULine;
                return true;
            }
            else
            {
                // Es ist etwas anderes schon eingeleitet worden.
                return false;
            }
        }

        private bool IsStylesChangedByTilde(
            string s,
            int pos,
            ref int newPos,
            FontStyles styles,
            ref FontStyles newStyles)
        {
            if (s.Substring(pos, 2).Equals("~~"))
            {
                newPos = pos + 2;
                newStyles = styles ^ FontStyles.StrikeOut;
                return true;
            }

            newPos = pos + 1;
            newStyles = styles;
            return false;
        }

        private void GetNextChar(string s, int pos, char c, ref int nextPos, ref char nextChar)
        {
            int tmpPos = s.IndexOf(c, pos);

            if (tmpPos < 0) return;

            if (nextPos < 0)
            {
                nextPos = tmpPos;
                nextChar = c;
            }
            else
            {
                if (tmpPos < nextPos)
                {
                    nextPos = tmpPos;
                    nextChar = c;
                }
            }
        }

        private FontStyle StylesToStyle(FontStyles styles)
        {
            FontStyle style = FontStyle.Regular;

            if ((styles & (FontStyles.BoldStar | FontStyles.BoldULine | FontStyles.AllBoldAndItalic)) > 0)
            {
                style |= FontStyle.Bold;
            }

            if ((styles & (FontStyles.ItalicStar | FontStyles.ItalicULine | FontStyles.AllBoldAndItalic)) > 0)
            {
                style |= FontStyle.Italic;
            }

            if ((styles & FontStyles.StrikeOut) > 0)
            {
                style |= FontStyle.StrikeOut;
            }

            return style;
        }

        private void AddBlockText(string s)
        {
            /*
                FontStyle
                ---------
                Default,
                Bold,//            ** ** or __ __
                Italic,//          * * or _ _
                StrikeOut,//       ~~ ~~
                BoldAndItalic,//   ** ** and _ _
                AllBoldAndItalic// *** ***

                Ein Block fängt IMMER mit Default an. So ist es einfacher und ein 
                Fehler im Text verschleppt sich dann nicht bis sonst wo hin.
            */
            FontStyles styles = FontStyles.Regular;
            int L = s.Length;
            int start = 0;
            /*
                Testtext für Markdown: **fett** normal __auch fett__ normal **fett mit _kursiv_ drin** normal
                **fett mit _kursiv_ und ~~durchgestrichen~~ drin** normal ~~durchgestrichen~~ normal
                _ _~~durchgestrichen~~ und kursiv_ _ normal * *kursiv mit Sternchen* *
             */
            while (start < L)
            {
                int pos = start;

                while (pos < L)
                {
                    int nextPos = -1;
                    char nextChar = (char)0;

                    // Ermitteln, welches das nächste zu prüfen ist.
                    GetNextChar(s, pos, '*', ref nextPos, ref nextChar);
                    GetNextChar(s, pos, '_', ref nextPos, ref nextChar);
                    GetNextChar(s, pos, '~', ref nextPos, ref nextChar);

                    if (nextChar == (char)0)
                    {
                        // Kein "*", "_" oder "~", der Text kann ab <start> übernommen werden.
                        FontStyle style = StylesToStyle(styles);
                        BlockText block=new BlockText(s.Substring(start), style);
                        blocks.Add(block);
                        return;
                    }

                    int newPos = -1;
                    FontStyles newStyles = FontStyles.Regular;

                    if (
                        (nextChar == '*' &&
                        IsStylesChangedByStar(s, nextPos, ref newPos, styles, ref newStyles))
                        ||
                        (nextChar == '_' &&
                        IsStylesChangedByULine(s, nextPos, ref newPos, styles, ref newStyles))
                        ||
                        (nextChar == '~' &&
                        IsStylesChangedByTilde(s, nextPos, ref newPos, styles, ref newStyles))
                        )
                    {
                        // Styles wurden geändert
                        if (nextPos > start)
                        {
                            // Einen Block mit Text hinzufügen.
                            FontStyle style = StylesToStyle(styles);
                            BlockText block = new BlockText(s.Substring(start, nextPos - start), style);
                            blocks.Add(block);                            
                        }

                        start = newPos;
                        styles = newStyles;
                    }

                    pos = newPos;
                }
            }
        }

        public void SetText(List<string> listText)
        {
            blocks.Clear();
            text.Assign(listText);
            Remove_br_();
            JoinLines();

            foreach (string s in text)
            {
                if (s == "")
                {
                    AddBlockEmptyLine();
                }
                else if (s.StartsWith("!["))
                {
                    AddBlockImage(s);
                }
                else if (s.StartsWith("#"))
                {
                    AddBlockHeadline(s);
                }
                else
                {
                    AddBlockText(s);
                }
            }

            int i = 0;

            while (i < blocks.Count)
            {
                if (blocks[i] is BlockHeadline)
                {
                    if (i > 0 && blocks[i - 1] is BlockEmptyLine)
                    {
                        blocks.RemoveAt(i - 1);
                        i--;
                        continue;
                    }

                    while (i < blocks.Count - 1 && blocks[i + 1] is BlockEmptyLine)
                    {
                        blocks.RemoveAt(i + 1);
                    }
                }
                
                i++;
            }
        }

        public bool IsEmpty
        {
            get { return blocks.Count == 0; }
        }

        private bool IsBreakAbleSign(char c)
        {
            return BreakAbleSigns.IndexOf(c) >= 0;
        }

        private void DrawDebugMark()
        {
            if (!bDebugMode) return;

            gfx.DrawRectangle(
                            XBrushes.Black,
                            rect.Left - 10,
                            rect.Top + dActTop,
                            10,
                            0.25
                        );

            XRect rectText = new XRect(
                            0,
                            rect.Top + dActTop,
                            rect.Left - 2,
                            dFontHeight
                        );

            gfx.DrawString(
                            (rect.Top + dActTop).ToString("#.0"),
                            fonts[FontStyle.Regular],
                            XBrushes.Black, rectText,
                            XStringFormats.CenterRight
                        );
        }

        private void DrawDebugInfo(string s)
        {
            if (!bDebugMode) return;

            gfx.DrawRectangle(
                            XBrushes.Black,
                            rect.Left + rect.Width,
                            rect.Top + dActTop,
                            10,
                            0.25
                        );

            XRect rectText = new XRect(
                            rect.Left + rect.Width + 2,
                            rect.Top + dActTop,
                            gfx.MeasureString(s, fonts[FontStyle.Regular]).Width,
                            dFontHeight
                        );

            gfx.DrawString(
                            s,
                            fonts[FontStyle.Regular],
                            XBrushes.Black, 
                            rectText,
                            XStringFormats.CenterLeft
                        );
        }

        private bool RenderText(BlockText block, double dWidthOfNextText)
        {
            do
            {
                if ((dActTop + dFontHeight) > rect.Height) return false;

                string text = block.Text;

                if (dActLeft == 0)
                {
                    // Es wurde gerade umgebrochen. So die Leerzeichen am Anfang enfernen.
                    text = text.TrimStart();
                }

                XFont font = fonts[block.Style];
                double w = gfx.MeasureString(text, font).Width;
                XRect rectText;

                if ((dActLeft + w + dWidthOfNextText) <= rect.Width)
                {
                    rectText = new XRect(
                            rect.Left + dActLeft,
                            rect.Top + dActTop,
                            w,
                            dFontHeight
                        );

                    gfx.DrawString(text, font, XBrushes.Black, rectText, XStringFormats.CenterLeft);

                    DrawDebugMark();

                    dActLeft += w;
                    return true;
                }

                int L = text.Length;

                // Es muss mindestens das erste Zeichen druckbar sein.
                w = gfx.MeasureString(text[0].ToString(), font).Width;

                if ((dActLeft + w) > rect.Width)
                {
                    dActLeft = 0;
                    dActTop += dFontHeight;
                    continue;
                }

                if (L == 1)
                {
                    // Enthält der Text nur ein Zeichen, dann das Zeichen Drucken und den Block beenden.
                    rectText = new XRect(
                            rect.Left + dActLeft,
                            rect.Top + dActTop,
                            w,
                            dFontHeight
                        );

                    gfx.DrawString(text, font, XBrushes.Black, rectText, XStringFormats.CenterLeft);

                    DrawDebugMark();

                    dActLeft += w;
                    return true;
                }

                // Durch Vermittlung herausfinden, wie lang der Text gedruckt wird.
                int posOk = 0;
                int posNotOk = L;

                while ((posNotOk - posOk) > 1)
                {
                    int center = ((posNotOk - posOk) >> 1) + posOk;

                    w = gfx.MeasureString(text.Substring(0, center + 1), font).Width;

                    if ((dActLeft + w) <= rect.Width)
                    {
                        // passt
                        posOk = center;
                    }
                    else
                    {
                        // passt nicht
                        posNotOk = center;
                    }
                }

                while (posOk >= 0 && !IsBreakAbleSign(text[posOk]))
                {
                    posOk--;
                }

                if (posOk >= 0)
                {
                    // Es kann ein Teil gedruckt werden. 
                    w = gfx.MeasureString(text.Substring(0, posOk + 1), font).Width;

                    rectText = new XRect(
                            rect.Left + dActLeft,
                            rect.Top + dActTop,
                            w,
                            dFontHeight
                        );

                    gfx.DrawString(
                            text.Substring(0, posOk + 1), 
                            font, 
                            XBrushes.Black, 
                            rectText,
                            XStringFormats.CenterLeft
                        );

                    DrawDebugMark();
                    block.Text = text.Remove(0, posOk + 1);
                }

                dActLeft = 0;
                dActTop += dFontHeight;
            } while (true);
        }

        private bool RenderImage(BlockImage block, bool nextIsText)
        {
            if (dActLeft > 0)
            {
                dActLeft = 0;
                dActTop += dFontHeight;
            }

            DrawDebugMark();
            double h = 0;

            if (dActTop > 0) h += (dFontHeight * 0.5);

            double dImageTopMargin = h;

            h += block.Hmm;

            if (nextIsText)
            {
                // unter dem Bild eine halbe Zeile + eine ganze Textzeile als Bildunterschrift
                h += (dFontHeight * 1.5);  
            }

            DrawDebugInfo("h: " + h.ToString("#.0"));

            if ((dActTop + h) > rect.Height) return false;

            gfx.DrawImage(
                    block.Image, 
                    rect.Left +  ((rect.Width - block.Wmm) / 2), 
                    rect.Top + dActTop + dImageTopMargin, 
                    block.Wmm, 
                    block.Hmm
                );

            DrawDebugMark();
            dActTop += dImageTopMargin + block.Hmm;

            if (nextIsText)
            {
                dActTop += (dFontHeight * 0.5);
            }

            return true;
        }

        private double RenderHeadline(BlockHeadline block, bool onlyMeasure, bool spaceBefore, bool spaceAfter)
        {
            XFont font = fontHeadline[block.Level - 1];
            double hFont = gfx.MeasureString("Wq", font).Height;
            double h = 0;

            if (spaceBefore)
            {
                h += hFont;

                if (!onlyMeasure)
                {
                    DrawDebugMark();
                    dActTop += hFont;
                }
            }

            string[] texts = block.HeadLine.Replace("<br>", ((char)1).ToString()).Split((char)1);

            for (int i = 0; i < texts.Length; i++)
            {
                string text = texts[i].Trim();
                do
                {
                    double w = gfx.MeasureString(text, font).Width;
                    XRect rectText;

                    if (w <= rect.Width)
                    {
                        h += hFont;

                        if (!onlyMeasure)
                        {
                            rectText = new XRect(
                                    rect.Left,
                                    rect.Top + dActTop,
                                    w,
                                    dFontHeight
                                );

                            gfx.DrawString(text, font, XBrushes.Black, rectText, XStringFormats.CenterLeft);

                            DrawDebugMark();
                            dActTop += hFont;
                        }

                        break;
                    }

                    // Durch Vermittlung herausfinden, wie lang der Text gedruckt wird.
                    int L = text.Length;
                    int posOk = 0;
                    int posNotOk = L;

                    while ((posNotOk - posOk) > 1)
                    {
                        int center = ((posNotOk - posOk) >> 1) + posOk;

                        w = gfx.MeasureString(text.Substring(0, center + 1), font).Width;

                        if ((dActLeft + w) <= rect.Width)
                        {
                            // passt
                            posOk = center;
                        }
                        else
                        {
                            // passt nicht
                            posNotOk = center;
                        }
                    }

                    while (posOk >= 0 && !IsBreakAbleSign(text[posOk]))
                    {
                        posOk--;
                    }

                    if (posOk < 0) posOk = L;

                    if (!onlyMeasure)
                    {
                        // Es kann ein Teil gedruckt werden. 
                        w = gfx.MeasureString(text.Substring(0, posOk + 1), font).Width;

                        rectText = new XRect(
                                rect.Left + dActLeft,
                                rect.Top + dActTop,
                                w,
                                dFontHeight
                            );

                        gfx.DrawString(
                                text.Substring(0, posOk + 1),
                                font,
                                XBrushes.Black,
                                rectText,
                                XStringFormats.CenterLeft
                            );

                        DrawDebugMark();
                        dActTop += hFont;
                    }

                    h += hFont;
                    text = text.Remove(0, posOk + 1).Trim();

                } while (true);
            }

            dActLeft = 0;

            // Unter dem Titel eine Leerzeile.
            if (spaceAfter)
            {
                h += hFont * 0.25;

                if (!onlyMeasure)
                {
                    DrawDebugMark();
                    dActTop += hFont * 0.25;
                }
            }

            return h;
        }

        public bool Render(XGraphics gfx, ref XRect rect)
        {
            this.gfx = gfx;

            this.rect = rect;
            dActLeft = 0;
            dActTop = 0;

            while (!IsEmpty)
            {
                BlockBase block = blocks[0];
                bool done = false;

                if (block is BlockText)
                {
                    double dWidthOfNextText = 0;

                    if (blocks.Count >= 2 && blocks[1] is BlockText)
                    {
                        BlockText nextBlock = blocks[1] as BlockText;
                        string text = nextBlock.Text;
                        
                        if (text != "" && IsBreakAbleSign(text[0]))
                        {
                            int w = 1;

                            if (text[0] == '.')
                            {
                                int L = text.Length;
                                
                                while (w < L)
                                {
                                    if (text[w] != '.') break;

                                    w++;
                                }
                            }

                            XFont font = fonts[nextBlock.Style];
                            dWidthOfNextText = gfx.MeasureString(text.Substring(0, w), font).Width;
                        }
                    }

                    done = RenderText(block as BlockText, dWidthOfNextText);
                }
                else if (block is BlockEmptyLine)
                {
                    if (dActLeft > 0 || dActTop > 0)
                    {
                        // Wenn beides Null ist, dann ist das eine Leerzeile
                        // am Anfang einer Seite und braucht nicht.
                        dActLeft = 0;
                        dActTop += dFontHeight;
                    }

                    done = true;
                }
                else if (block is BlockImage)
                {
                    done = RenderImage(
                            block as BlockImage,
                            text.Count >= 2 && blocks[1] is BlockText
                        );
                }
                else if (block is BlockHeadline)
                {
                    if (dActLeft > 0)
                    {
                        dActLeft = 0;
                        dActTop += dFontHeight;
                    }

                    DrawDebugMark();
                    double h = 0;

                    int idx = 0;
                    bool spaceBefore = dActTop != 0;
                    bool spaceAfter;

                    while (idx < blocks.Count)
                    {
                        if (!(blocks[idx] is BlockHeadline)) break;

                        spaceAfter = idx < blocks.Count - 1;

                        if (spaceAfter)
                        {
                            spaceAfter = !(blocks[idx + 1] is BlockHeadline);
                        }

                        h += RenderHeadline(blocks[idx] as BlockHeadline, true, spaceBefore, spaceAfter);
                        spaceBefore = false;
                        idx++;
                    }

                    if (idx < blocks.Count)
                    {
                        if (blocks[idx] is BlockImage)
                        {
                            BlockImage blockImage = blocks[idx] as BlockImage;
                            h += blockImage.Hmm;
                        }
                        else
                        {
                            h += dFontHeight;
                        }
                    }

                    DrawDebugInfo("h: " + h.ToString("#.0"));

                    if ((dActTop + h) > rect.Height) return true;

                    spaceBefore = dActTop != 0;
                    // Alle Headlines rendern
                    while (blocks.Count > 0)
                    {
                        if (!(blocks[0] is BlockHeadline)) break;

                        spaceAfter = blocks.Count > 1;

                        if (spaceAfter)
                        {
                            spaceAfter = !(blocks[1] is BlockHeadline);
                        }

                        RenderHeadline(blocks[0] as BlockHeadline, false, spaceBefore, spaceAfter);
                        spaceBefore = false;
                        blocks.RemoveAt(0);
                    }

                    continue;
                }
                else
                {
                    return false;
                }

                if (done)
                {
                    blocks.RemoveAt(0);
                }
                else
                {
                    return true;
                }
            }

            return false;
        }
    }
}
