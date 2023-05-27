const jwt = require("jsonwebtoken")
const log4js = require("./log4j")
const nodemailer = require('nodemailer'); //引入模块


const CODE = {
  SUCCESS:200,
  PARAM_ERROR : 10001, //参数错误
  USER_ACCOUNT_ERROR:20001, //账号或密码错误
  USER_LOGIN_ERROR:30001, // 用户未登录
  BUSINESS_ERROR:40001, //业务请求失败
  AUTH_ERROR:50001, //认证失败或TOKEN过期
}


module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum 
   * @param {number} pageSize 
   */
  pager({pageNum=1,pageSize=10}){
    pageNum*=1;
    pageSize*=1;
    const skipIndex = (pageNum-1)*pageSize;
    return {
      page:{
        pageNum,
        pageSize
      },
      skipIndex
    }
  },
  success(data='',msg='',code=CODE.SUCCESS){
    
    return {
      code,data,msg
    }
  },
  fail(msg='',code=CODE.BUSINESS_ERROR){
    
    return {
      code,msg
    }
  },
  CODE,
  decoded(authorization){
    if(authorization){
      let token = authorization.split(" ")[1]
      return   jwt.verify(token,"key")
    }
    return ""
  },
  getTreeMenu(rootList,id,list){
  for(let i = 0;i<rootList.length;i++){
    let item = rootList[i]
    if(String(item.parentId?.slice().pop()) == String(id)){
      list.push(item._doc)
    }
  }
  list.map(item=>{
    item.children = []
    this.getTreeMenu(rootList,item._id,item.children)
    if(item.children.length == 0){
      delete item.children;
    }else if(item.children.length > 0 && item.children[0].menuType ==2){
      //快速区分按钮和菜单
      item.action = item.children
    }
  })
  return list 
},
formateDate(date,rule){
  let fmt = rule || 'MM-dd hh:mm:ss'
 
  const o = {
    
    "M+":date.getMonth(),
    "d+":date.getDate(),
    "h+":date.getHours(),
    "m+":date.getMinutes(),
    "s+":date.getSeconds(),

  }
  for(let key in o){
    if(new RegExp(`(${key})`).test(fmt)){
      const val = o[key] + ''
      fmt =  fmt.replace(RegExp.$1,RegExp.$1.length==1?val:('00'+val).substring(val.length))
    }
  }
  return date.getFullYear() + fmt
},
  async sendMail(mail,code,call){
    let transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: false,
      auth: {
        user: "3034221968@qq.com",
        pass: "eduwarriiflhdcgg"
      }
    })
    const receiver = {
      form:{
        name:"test",
        address:"3034221968@qq.com"
      },
      subject:"修改密码",
      to:mail,
      html:`
      <h1>你好,以下是您的邮箱验证码，</h1>
      <br>
      <table width="100%" style="border-collapse: collapse; border-spacing: 0;border: 0;height:120px;">
                      <tr height="40px" style="padding: 0;border: 0;">
                          <td style="width: 50px;font-size: 16px;font-weight: bold;line-height: 21px;color: rgba(255, 95, 46, 1);"
                              colspan="1"> 验证码： </td>
                          <td style="font-size: 16px;font-weight: 400;line-height: 21px;color: rgba(151, 151, 151, 1);"
                              colspan="3"> ${code} </td>
                      </tr>
                      <tr>
                          <td colspan="4"
                              style="font-size: 14px;font-weight: bold;line-height: 19px;color: rgba(151, 151, 151, 1);  padding: 0;border: 0;">
                              请不要将此码给其他人</td>
                      </tr>
                      <tr>
                          <td style="font-size: 14px;font-weight: bold;line-height: 19px;color: rgba(151, 151, 151, 1);  padding: 0;border: 0;"
                              colspan="1"> 有问题请联系管理员:</td>
                          <td style="position: relative;left: -10px;font-size: 12px;line-height: 19px;color: rgba(151, 151, 151, 1); padding: 0;border: 0;"
                              colspan="1" style="position: relative;left: -10px;font-size: 12px;line-height: 19px;color:
                              rgba(151, 151, 151, 1);">
                              yangt.feichangshuai@gmail.com</td>
                          <td style="font-size: 14px;font-weight: bold;line-height: 19px;color: rgba(151, 151, 151, 1);  padding: 0;border: 0;"
                              colspan="1"> github:</td>
                          <td style="position: relative;left: -10px;font-size: 12px;line-height: 19px;color: rgba(151, 151, 151, 1); padding: 0;border: 0;"
                              colspan="1">https://github.com/Harmony-camp/ckw-manager</td>
                      </tr>
                      
                  </table>
      `
    }
    await transporter.sendMail(receiver,(error,info)=>{
      if(error){
        return console.log('发送失败 :>> ', error);
      }
      transporter.close()
      console.log('发送成功 :>> ', info.response);
    })
  }
}