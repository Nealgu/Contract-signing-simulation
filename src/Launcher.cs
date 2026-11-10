using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

[assembly: AssemblyTitle(Launcher.CompanyName)]
[assembly: AssemblyDescription("SAP × AI 公司经营模拟")]
[assembly: AssemblyProduct(Launcher.CompanyName)]
[assembly: AssemblyVersion("1.0.0.0")]

internal static class Launcher
{
    internal const string CompanyName = "O一下 信息科技有限公司";

    [STAThread]
    private static void Main()
    {
        try
        {
            string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "CornerOffice");
            Directory.CreateDirectory(folder);
            string appFile = Path.Combine(folder, "CornerOffice.html");
            using (Stream resource = Assembly.GetExecutingAssembly().GetManifestResourceStream("CornerOffice.html"))
            using (MemoryStream buffer = new MemoryStream())
            {
                resource.CopyTo(buffer);
                File.WriteAllBytes(appFile, buffer.ToArray());
            }

            string edge = FindEdge();
            if (edge == null)
            {
                Process.Start(new ProcessStartInfo(appFile) { UseShellExecute = true });
                return;
            }

            string url = new Uri(appFile).AbsoluteUri;
            Process.Start(new ProcessStartInfo(edge, "--app=\"" + url + "\" --window-size=1336,920")
            {
                UseShellExecute = false
            });
        }
        catch (Exception error)
        {
            MessageBox.Show("无法启动" + CompanyName + "。\n\n" + error.Message, CompanyName,
                MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private static string FindEdge()
    {
        string[] folders = {
            Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86),
            Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)
        };
        foreach (string folder in folders)
        {
            string path = Path.Combine(folder, "Microsoft", "Edge", "Application", "msedge.exe");
            if (File.Exists(path)) return path;
        }
        return null;
    }
}
