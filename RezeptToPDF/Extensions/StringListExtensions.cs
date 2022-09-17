using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RezeptToPDF.Extensions
{
    public static class StringListExtensions
    {
        public static void LoadFormFile (this List<string> list, string filename)
        {
            list.Clear();
            string[] lines = File.ReadAllLines(filename);

            foreach (string line in lines)
            {
                list.Add(line);
            }
        }

        public static void Assign(this List<string> list, List<string> sourceList)
        {
            list.Clear();

            foreach (string s in sourceList)
            {
                list.Add(s);
            }
        }
    }
}
