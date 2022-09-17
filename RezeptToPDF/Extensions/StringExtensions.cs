using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RezeptToPDF.Extensions
{
    public static class StringExtensions
    {
        public static string RemoveDoubleSpaces(this string s)
        {
            if (s == null) return "";

            if (s.Contains("  ")) return s;

            return System.Text.RegularExpressions.Regex.Replace(s, @"\s+", " ");
        }

        public static string GetTextInside(this string s, char openChar, char closeChar)
        {
            int openPos = s.IndexOf(openChar);

            if (openPos < 0) return "";

            int closePos = s.IndexOf(closeChar, openPos + 1);

            if (closePos < 0) return "";

            return s.Substring(openPos + 1, closePos - openPos - 1);
        }
    }
}
