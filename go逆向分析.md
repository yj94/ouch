## 题目链接
https://yj233.lanzoul.com/iu58h14tuyba
需要先脱壳
## 现在就已知flag为16位 如果key和flag都正确就会输出flag{得到的flag} 因为是go语言这个题目的字符串都做了异或 所以我就写了注释 好让师傅们分析 最关键的函数也就两个 第一个就是获取key后经过CalcGOffset计算出全局变量 main_G_offset ，这个变量在main_getCryptOne函数里面作为变量，和密文进行一些操作，然后得到返回值如果等于0x6f就会得到正确flag
## 主函数

```cpp
// main.main
void __fastcall main_main()
{
  _12_uint8 *p__12_uint8; // rax
  __int64 i; // rcx
  __int64 j; // rcx
  _13_uint8 *p__13_uint8; // rax
  __int64 k; // rcx
  _5_uint8 *p__5_uint8; // rax
  __int64 m; // rcx
  string *flag_value; // rax
  __int64 flag_index; // rcx
  char *ptr; // r8
  char v10; // bl
  __int128 v11; // kr00_16
  __int64 n; // rcx
  __int128 v13; // kr10_16
  __int64 v14; // [rsp+10h] [rbp-1F0h]
  __int64 v15; // [rsp+18h] [rbp-1E8h]
  __int64 v16; // [rsp+18h] [rbp-1E8h]
  __int64 v17; // [rsp+18h] [rbp-1E8h]
  __int64 v18; // [rsp+18h] [rbp-1E8h]
  __int128 v19; // [rsp+20h] [rbp-1E0h]
  __int128 v20; // [rsp+20h] [rbp-1E0h]
  __int128 v21; // [rsp+20h] [rbp-1E0h]
  char v22[11]; // [rsp+55h] [rbp-1ABh] BYREF
  __int64 v23; // [rsp+60h] [rbp-1A0h]
  __int64 v24; // [rsp+68h] [rbp-198h]
  __int64 v25; // [rsp+70h] [rbp-190h]
  __int64 v26; // [rsp+78h] [rbp-188h]
  __int64 v27; // [rsp+80h] [rbp-180h]
  __int64 v28[2]; // [rsp+8Bh] [rbp-175h] BYREF
  __int64 v29[4]; // [rsp+9Bh] [rbp-165h] BYREF
  char v30[32]; // [rsp+C0h] [rbp-140h] BYREF
  char v31[32]; // [rsp+E0h] [rbp-120h] BYREF
  char v32[32]; // [rsp+100h] [rbp-100h] BYREF
  char v33[32]; // [rsp+120h] [rbp-E0h] BYREF
  __int64 v34; // [rsp+140h] [rbp-C0h]
  __int64 v35; // [rsp+148h] [rbp-B8h]
  __int64 v36; // [rsp+150h] [rbp-B0h]
  __int64 v37; // [rsp+158h] [rbp-A8h]
  __int64 v38; // [rsp+160h] [rbp-A0h]
  __int64 fail_mess; // [rsp+168h] [rbp-98h]
  __int64 v40; // [rsp+170h] [rbp-90h]
  __int64 v41; // [rsp+178h] [rbp-88h]
  string *p_string; // [rsp+180h] [rbp-80h]
  _QWORD v43[2]; // [rsp+188h] [rbp-78h] BYREF
  _QWORD key[2]; // [rsp+198h] [rbp-68h] BYREF
  _QWORD v45[2]; // [rsp+1A8h] [rbp-58h] BYREF
  _QWORD success_mess[2]; // [rsp+1B8h] [rbp-48h] BYREF
  _QWORD fail_mess_2[2]; // [rsp+1C8h] [rbp-38h] BYREF
  _QWORD v48[2]; // [rsp+1D8h] [rbp-28h] BYREF
  _QWORD flag[2]; // [rsp+1E8h] [rbp-18h] BYREF

LABEL_1:
  p_string = runtime_newobject(&RTYPE_string);
  p__12_uint8 = runtime_newobject(&RTYPE__12_uint8);
  *p__12_uint8 = 0xA1AFE4B0B1B4AA8DLL;
  *&(*p__12_uint8)[8] = 0xE4FEBD;
  for ( i = 0LL; i < 11; ++i )
    (*p__12_uint8)[i] ^= 0xC4;
  v22[2] = 0;
  *v22 = -9078;
  for ( j = 0LL; j < 2; ++j )
    v22[j] ^= 0xAFu;
  v41 = p__12_uint8;
  v19 = runtime_slicebytetostring(v30, v22, 3LL, 3LL);// 获取key输入的字符串处理
  v26 = *(&v19 + 1);
  v37 = v19;
  v15 = runtime_convTslice(v41, 12LL, 12LL);
  v45[0] = &RTYPE__slice_uint8;
  v45[1] = v15;
  fmt_Fprintf(go_itab__os_File_io_Writer, os_Stdout, v37, v26, v45, 1LL, 1LL);
  key[0] = &RTYPE__ptr_string;
  key[1] = p_string;
  fmt_Fscanln(go_itab__os_File_io_Reader, os_Stdin, key, 1LL, 1LL);// 获取key
  main_CalcGOffset(p_string->ptr, p_string->len);
  p__13_uint8 = runtime_newobject(&RTYPE__13_uint8);
  strcpy(p__13_uint8, "Dc}xy-kalj7-");          // 获取flag的字符串
  for ( k = 0LL; k < 12; ++k )
    (*p__13_uint8)[k] ^= 0xD;
  v40 = p__13_uint8;
  p__5_uint8 = runtime_newobject(&RTYPE__5_uint8);
  strcpy(p__5_uint8, "lkcf");                   // fail提示的字符串
  for ( m = 0LL; m < 4; ++m )
    (*p__5_uint8)[m] ^= 0xA;
  fail_mess = p__5_uint8;
  p_string = runtime_newobject(&RTYPE_string);
  v20 = runtime_slicebytetostring(v29 + 5, v22, 3LL, 3LL);
  v23 = *(&v20 + 1);
  v34 = v20;
  v16 = runtime_convTslice(v40, 13LL, 13LL);
  v43[0] = &RTYPE__slice_uint8;
  v43[1] = v16;
  fmt_Fprintf(go_itab__os_File_io_Writer, os_Stdout, v34, v23, v43, 1LL, 1LL);
  flag[0] = &RTYPE__ptr_string;
  flag[1] = p_string;
  fmt_Fscanln(go_itab__os_File_io_Reader, os_Stdin, flag, 1LL, 1LL);// 获取flag
  flag_value = p_string;
  if ( vlaue_0x10 == p_string->len )            // flag长度必须为16
  {
    flag_index = 0LL;
    while ( flag_value->len > flag_index )
    {
      if...                                     // go机制 忽略
      ptr = flag_value->ptr;
      if ( flag_index % vlaue_0x10 >= vlaue_0x10 )
        goto LABEL_30;
      v10 = (flag_index % vlaue_0x10) ^ *(main_G_flag + flag_index % vlaue_0x10);
      if...                                     // go机制 忽略
      if...                                     // 同上
      *&v22[3] = flag_index;
      if ( main_getCryptOne(ptr[flag_index], (flag_index % value_0xC) ^ main_key[flag_index % value_0xC]) != v10 )// 这个函数的返回值必须为0x10
      {
        v11 = runtime_slicebytetostring(v32, v22, 3LL, 3LL);
        v24 = *(&v11 + 1);
        v36 = v11;
        v17 = runtime_convTslice(fail_mess, 5LL, 5LL);
        fail_mess_2[0] = &RTYPE__slice_uint8;
        fail_mess_2[1] = v17;
        fmt_Fprintf(go_itab__os_File_io_Writer, os_Stdout, v36, v24, fail_mess_2, 1LL, 1LL);
        return;
      }
      flag_index = *&v22[3] + 1LL;
      flag_value = p_string;
    }
    v28[0] = -13741875160925191041uLL;          // 可能是密文
    v28[1] = -13093018226074891700uLL;
    strcpy(v29, "V\b^P");                       // 可能是成功提示字符串，但没有引用
    for ( n = 0LL; n < 20; ++n )
      *(v28 + n) ^= 0x2Du;
    v13 = runtime_slicebytetostring(v31, v28, 21LL, 21LL);
    v25 = *(&v13 + 1);
    v38 = v13;
    v14 = runtime_convTstring(p_string->ptr, p_string->len);
    success_mess[0] = &RTYPE_string;
    success_mess[1] = v14;
    fmt_Fprintf(go_itab__os_File_io_Writer, os_Stdout, v38, v25, success_mess, 1LL, 1LL);// 推理得出是 输出成功
  }
  else                                          // flag长度不为16 退出
  {
    v21 = runtime_slicebytetostring(v33, v22, 3LL, 3LL);
    v27 = *(&v21 + 1);
    v35 = v21;
    v18 = runtime_convTslice(fail_mess, 5LL, 5LL);
    v48[0] = &RTYPE__slice_uint8;
    v48[1] = v18;
    fmt_Fprintf(go_itab__os_File_io_Writer, os_Stdout, v35, v27, v48, 1LL, 1LL);
  }
}
```

## goffset函数

```cpp
 // main.CalcGOffset
__int64 __usercall main_CalcGOffset@<rax>(__int64 a1, __int64 a2)
{
  __int64 v2; // rcx
  __int64 v3; // rdx
  __int64 v4; // rax
  unsigned int v5; // ebx
  unsigned int v6; // esi
  __int64 v7; // rdi
  __int64 result; // rax
  __int64 v9; // [rsp+20h] [rbp-18h]

  while ( 1 )
  {
    v2 = a2;
    v3 = a1;
    v4 = 0LL;
    v5 = 0;
    while ( v4 < v2 )
    {
      v6 = *(v3 + v4);
      if ( v6 >= 0x80 )
      {
        v6 = runtime_decoderune(v3, v2, v4);    // DecodeRune的作用是通过传入的utf8字节序列转为一个rune即unicode。rune切片转为字符串:
        v7 = v9;
        v2 = a2;
        v3 = a1;
      }
      else
      {
        v7 = v4 + 1;
      }
      v5 += v6;
      v4 = v7;
    }
    if ( qword_58EE18 )
      break;
    runtime_panicdivide();	//go机制 忽略
    runtime_morestack_noctxt();
  }
  result = v5 / qword_58EE18;
  main_G_offset = v5 % qword_58EE18;
  return result;
}
```


## CryptOne函数

```cpp
// main.getCryptOne
char __golang main_getCryptOne(char a1, char a2)
{
  unsigned __int64 v2; // rdx
  __int16 v3; // si
  unsigned __int8 v4; // di

  if...
  if...
  v2 = (qword_58EE18 - 1) % qword_58EE18;
  LOBYTE(v3) = a2
             + (((main_G_offset + a1 - 65) % qword_58EE18) ^ *(main_keyTable + (main_G_offset + a1 - 65) % qword_58EE18))
             - 65;
  if...
  v4 = v2 ^ *(main_keyTable + v2);              // 最重要的地方
  if ( v3 > v4 )
  {
    if ( 0 % qword_58EE18 < qword_58EE18 )      // 应该忽略
    {
      if ( v4 )
        return v3 % v4 + ((0 % qword_58EE18) ^ *(main_keyTable + 0 % qword_58EE18)) - 1;
      runtime_panicdivide();                    // 这里正常来说要忽略的 因为主动触发了除法异常
    }
    runtime_panicIndex();
  }
  return v3;
}
```
## exp 谢谢B.M.K师傅
``` python
key = []
flag = []
guess = 0
main_key = [0xAB, 0xB6, 0x94, 0x8F, 0xA4,
            0x93, 0xAA, 0xA7, 0x91, 0x9A, 0xB4, 0x93]
main_G_flag = [0x71, 0xA1, 0x96, 0x61, 0x94, 0x67, 0x74,
               0x79, 0x60, 0x86, 0x8E, 0x66, 0xAD, 0x87, 0x89, 0x51]
main_keyTable = [0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x4F, 0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x5F, 0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x4F, 0x41, 0x43, 0x41, 0x47,
                 0x41, 0x43, 0x41, 0x7F, 0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x4F, 0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x5F, 0x41, 0x43, 0x41, 0x47, 0x41, 0x43, 0x41, 0x4F, 0x41, 0x43]


def main_getCryptOne(f, k):

    v3 = k+(((main_G_off+f-65) % 58) ^
            (main_keyTable[(main_G_off+f-65) % 58]))-65
    if v3 > 0x7a:  # v4=0x7a
        print(v3%0x7a+0x40)
        return v3 % 0x7a + 0x40
    print(v3)
    return v3


key = [0xab, 0xb7, 0x96, 0x8c, 0xa0, 0x96, 0xac, 0xa0,
       0x99, 0x93, 0xbe, 0x98, 0xab, 0xb7, 0x96, 0x8c]
enc = [0x71, 0xa0, 0x94, 0x62, 0x90, 0x62, 0x72, 0x7e,
       0x68, 0x8f, 0x84, 0x6d, 0xa1, 0x8a, 0x87, 0x5e]
#for idx in range(16):  # 密文单字节爆破
    #print(hex((idx % 0xc) ^ main_key[idx % 0xc]), end=",")
    #print(hex(main_G_flag[idx % 16] ^ (idx % 16)), end=',')
for main_G_off in range(58):
    print(f'main_G_off:{main_G_off}:',end='')
    flag = [0]*16
    for guess in range(1, 0x7f):
        for i in range(16):
            t = main_getCryptOne(guess, key[i])
            if t == enc[i]:
                flag[i] = guess
    print(bytes(flag).decode())
#key 2 flag IlGYsOIaREIXyVtU

```
