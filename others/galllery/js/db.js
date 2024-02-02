function jpn() {}
;function db() {
 this.us = null;
 this.vs = null;
 this.sj = this.sj || {};
 this.idus = 0;
 this.t = 0;
 this.ty = 100;
 this.t0 = 0;
 this.tjp = 0;
 this.role = 0;
 this.vip = 0;
 this.coid = '';
 this.htma = new Array();
 this.wbid = 0;
 this.nw = 1;
 this.ifjp = 0;
 this.downf = 0;
 this.curdiv = 1;
 this.historya = new Array();
 this.curh = -1;
 this.gett = function() {
  return db.t + (new Date().getTime() - db.t0) + db.ty;
 }
 ;
 this.gets = function() {
  return (db.gett() + 8 * 3600000) % (24 * 3600000);
 }
 ;
 this.getdzeros = function() {
  return db.gett() - db.gets();
 }
 ;
 this.getd = function(h) {
  h = h || 0;
  return j().getdatetime(db.gett() - h * 3600000).split(' ')[0];
 }
 ;
 this.setnw = function(set) {
  if (set != undefined) {
   db.nw = set;
  }
  ;if (db.nw == -2) {
   if (window.js) {
    db.nw = window.js.getapn();
   } else {
    db.nw = 4;
   }
  }
  var s = '未知连接情况';
  if (db.nw == 1)
   s = '本地wifi(高速)';
  if (db.nw == 0 || db.nw == -1) {
   s = '无网络';
   j('#ldbtishi').html('脱网模式');
  }
  if (db.nw == 2 || db.nw == 3)
   s = '无线网络(低速)';
  if (db.nw == 4)
   s = '已联网';
  j('#nw').html('当前网络:' + s);
 }
 ;
 this.readldb = function() {
  if (db.ldb != "") {
   var sss = '';
   var retrs = db.ldb.transaction(function(tx) {
    tx.executeSql("SELECT * FROM myd ", [], function(tx, rs) {
     for (var i = 0; i < rs.rows.length; i++) {
      sss += j().getdatetime(parseInt(rs.rows.item(i).name)) + '时的操作<input type=button value="执行" onclick=""><input type=button value="取消" onclick="db.ldbdel(\'' + rs.rows.item(i).name + '\')"><br>';
     }
     if (sss != '')
      j().jalert('发现你曾在脱网时候的操作：<br>' + sss);
    });
   });
  }
 }
 ;
 this.ldbdel = function(name) {
  db.ldb.transaction(function(tx) {
   tx.executeSql('DELETE from myd where name like ?', [name], function(tx, result) {
    db.readldb();
   }, function(tx, error) {});
  });
 }
 ;
 this.strzm = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 this.ldbsql = function(v1, v2, func) {
  if (db.ldb != "") {
   var s = '';
   var ov1 = v1;
   v1 = v1.split('.jsp')[1];
   for (var i = 0; i < v1.length - 1; i++) {
    var c = v1.substring(i, i + 1);
    if (db.strzm.indexOf(c) > -1)
     s += c;
   }
   v1 = s;
   var retrs = db.ldb.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS myt(name TEXT,info TEXT)', []);
    tx.executeSql("SELECT * FROM myt where name like ?", [v1], function(tx, rs) {
     if (rs.rows.length > 0) {
      if (v2 == null) {
       var sd = rs.rows.item(0).info;
       if (sd) {
        var a = new Array();
        a[0] = JSON.parse(rs.rows.item(0).info);
        j.each(a, func);
        return;
       } else {
        tx.executeSql("delete from myt where name = ?", [v1], function(tx1, rs1) {}, function(tx1, error) {
         alert(error.message);
        });
       }
      } else {
       tx.executeSql("update myt set info=? where name = ?", [v2, v1], function(tx1, rs1) {}, function(tx1, error) {
        alert(error.message);
       });
      }
     } else {
      if (v2 == null) {
       tx.executeSql('CREATE TABLE IF NOT EXISTS myd(name TEXT,info TEXT, f TEXT)', []);
       tx.executeSql(' insert into myd values(?,?,?)', [(db.gett() + ''), ov1, j('#jg-0').attr('uri')], function(tx1, rs1) {
        db.readldb();
       }, function(tx1, error) {
        alert(error.message);
       });
      } else {
       tx.executeSql(' insert into myt values(?,?)', [v1, v2], function(tx1, rs1) {}, function(tx1, error) {
        alert(error.message);
       });
      }
     }
    });
   });
  }
 }
 ;
 this.getus = function(sw, func, gjson) {
  sw = sw || "aid=''";
  var slimit = ' limit 0,1';
  if (window.dl)
   if (window.dl.ini2)
    slimit = "";
  gjson = gjson || {};
  var addt2 = ""
      , addq2 = ""
      , addw2 = ""
      , adda2 = "";
  if (window.location.host.indexOf("kxtui") == -1) {
   addt2 = "|wbs";
   addq2 = "|all";
   addw2 = "|cdom='" + window.location.host + "' limit 0,1";
  }
  db.sajax('us|vs' + (gjson.addt || '') + addt2, 'all:id|(idus)all' + (gjson.addq || '') + addq2, sw + "|galx=" + galx + " and idus in ({0}) order by zg desc" + slimit + (gjson.addw || '') + addw2, '|' + (gjson.adda || '') + adda2, function(i, json) {
   db.showidus(func, json);
  }, '&option=011', 1);
 }
 ;
 this.setidus = function(func, arg) {
  var arg = (arg || '');
  if (lurl.indexOf('?') == -1)
   lurl += '?';
  var aid = j().getv('aid', '', lurl + '&' + arg);
  if (db.idus > 1000) {
   db.showidus(func);
   return;
  }
  if (aid != '') {
   var strid = j().getv('id', '', window.location + '');
   var sid = "";
   if (strid != '')
    sid = '&id=' + strid;
   if (arg == '')
    sid += '&aid=' + aid;
   db.jp('http:\/\/' + (window.domain) + '/login.jsp?' + arg + sid, function(i, json) {
    if (json.upd[0].id < 1000 && (window.location + '').indexOf('h.html') > -1) {
     j().jalert('无法自动登录：' + aid + ' ' + domain);
     return;
    }
    var scondi = "";
    if (json.upd[0].id > 1000 && json.sj) {
     strid = json.upd[0].id;
    }
    scondi = "(aid='" + aid + "'" + scondi + ")";
    if (strid != '')
     scondi = 'id=' + strid;
    db.getus(scondi, func, arg);
   }, 1);
  } else {
   db.getus("", func, arg);
  }
 }
 ;
 this.setv = function(r, t) {
  j.each(r, function(i, n) {
   j('[t="' + t + '"][en="' + i + '"]').html(n);
  });
 }
 ;
 this.showidus = function(func, json) {
  if (json) {
   db.t0 = new Date().getTime();
   if (json.t) {
    db.t = json.t;
   } else {
    db.t = db.t0
   }
   if (db.idus < 1000) {
    db.vs = json.vs;
    if (json.us) {
     db.us = json.us;
     j.each(db.us.all, function(i, n) {
      if (db.vs.all.sx)
       if (db.vs.all[i] && i != 'sx') {
        db.idus = i;
        db.role = n.role;
        db.vip = db.vs.all[i].vip;
       }
     });
    }
   }
  }
  if (db.idus < 1000) {} else {
   var pathd = Math.floor(db.idus / 1000);
   j('.vip').css({
    width: '160px',
    height: '32px',
    background: 'url(' + imgp + 'vip' + db.vs.all[db.idus].vip + '.png)'
   });
   if (db.vs.all)
    if (db.vs.all[db.idus]) {
     j('.sex').addClass(db.vs.all[db.idus].sex == 0 ? 'girl' : 'boy');
     lv = db.vs.all[db.idus].lv;
     var s5 = db.vs.all[db.idus].s5;
     var s9 = db.vs.all[db.idus].s9;
     if (window.setfh)
      j(".zyfh").html(db.vs.all[db.idus].sex == 0 ? setfh(lv, s5, s9) : setfh1(lv, s5, s9));
     if (window.getxq4usid)
      j(".zyqh").html(getxq4usid(db.idus, 1));
     if (1 == db.us.all[db.idus].iftx) {
      j(".ppus").css({
       "background": "url(pg/us/" + pathd + "/" + db.idus + ".jpg) no-repeat center",
       "background-size": "90px 90px"
      });
     } else {
      j(".ppus").addClass((db.vs.all[db.idus].sex == 0 ? "w" : "m") + (db.vs.all[db.idus].lx + 1));
     }
     if (j('#vsn4').length > 0)
      if (db.vs.all[db.idus].n4 > j('#vsn4').vale() && j('#vsn4').vale() > 0)
       bezier('jinyb');
     db.setv(db.vs.all[db.idus], 'vs');
    }
  }
  if (typeof (func) == "string") {
   eval(func);
  } else {
   var a = new Array();
   a[0] = db.idus;
   j.each(a, func);
  }
 }
 ;
 this.jalerte = function(sres) {
  if (sres.indexOf('缺少') > -1 && ui.ui.all['aaqyev']) {
   ui.ui.all['aaqyev'].cfun = '';
   ui.ui.all['aaqyev'].ca = "打装备|db.gethtm('sy')`去商城|db.gethtm('sc')";
   sres = "缺少相关道具。<br>" + j().geta(ui.ui.all['aaqyev']);
  }
  if ((sres.indexOf('金元宝不足') > -1 || sres.indexOf('需要VIP') > -1) && ui.ui.all['aaqyev']) {
   if (usfrom.indexOf('ios') > -1) {
    sres = "" + sres + "，每天登录一次，在活动中签到，就能获得10元宝了。";
   } else {
    ui.ui.all['aaqyev'].cfun = '';
    ui.ui.all['aaqyev'].ca = '确定|cz_ini();`取消|j().cls()';
    if (window.OpSphinx)
     ui.ui.all['aaqyev'].ca = '确定|window.close()`取消|j().cls()';
    if (usfrom == 'yd2') {
     sres = "金币不足，马上充值,升VIP吗？<br>有你支持，我们会做得更好！<br><br><br>";
    } else {
     sres = "" + sres + "，马上去“登录页”-“帐户充值”买金元宝升VIP吗？<br>有你支持，我们会做得更好！<br>" + j().geta(ui.ui.all['aaqyev']);
     if (j().getv("cpServiceId", "") == "760000036022")
      sres = "金币不足";
    }
   }
  }
  if (usfrom == 'yd2') {
   j().jaler(sres, null, "确定|cz_ini();`取消|j().cls('ggk')");
  } else {
   if (sres.indexOf('余额不足') > -1) {
    j().jaler(sres + "<br><br>", null, "立刻充值|ga.showPay();j().cls('ggk')");
   } else {
    j().jalert(sres);
   }
  }
 }
 ;
 this.jp = function(surl, func, argj, sdata) {
  jg_aj.ssurl = surl + sdata;
  if ((jg_aj.ssurl).indexOf('jg_dofunc') > 0) {
   db.dofunc(func, {});
   return;
  }
  if (db.ifjp == 1 && (db.gett() - db.tjp < 5000) && galx != 8) {
   if (db.role > 7)
    j().jalert('操作过快，上次读取操作还未完成！');
   console.log('操作过快，上次读取操作还未完成！');
   return;
  }
  db.ifjp = 1;
  db.tjp = db.gett();
  var djRco = j().getv('rco', -1, surl);
  if (db.nw == -2)
   db.setnw();
  if (db.nw == 0 || db.nw == -1) {
   db.ldbsql(surl, null, function(i, json) {
    if (surl.indexOf('merge=no') == -1)
     json = db.merge(json, argj);
    db.dofunc(func, json);
   });
   return;
  }
  if (surl.indexOf('setdomain=') > -1 || (window.location + '').indexOf('stdm=') > -1) {
   var ym = 'cyt86.com';
   var stdm = j().getv('stdm', '');
   var sdm = j().getv('setdomain', stdm, surl);
   if (sdm == '')
    sdm = domain.split('.')[0];
   if (surl.indexOf('http') == 0) {
    surla = surl.split('\/');
    surl = surl.substring(surla[2].length + 7);
    ym = surla[2].substring(surla[2].indexOf('.') + 1);
   }
   if (surl.indexOf('\/') != 0)
    surl = '\/' + surl;
   if (sdm == '7') {
    surl = 'http:\/\/9.gzggo.com' + surl;
   } else {
    surl = 'http:\/\/' + sdm + '.' + ym + surl;
   }
  } else {
   if ((window.location + '').indexOf('http') != 0) {
    if (surl.indexOf('http') != 0) {
     surl = 'http:\/\/' + (window.domain) + '\/' + surl;
    }
   }
  }
  if (surl.indexOf('\/') != 0 && surl.indexOf('http') != 0)
   surl = '\/' + surl;
  if (surl.indexOf('?') > 0) {
   var ifr = j('iframe').length;
   if (ifr > 0)
    surl += '&iframe=' + ifr + j('iframe').vale('id');
  }
  var ifcache = false;
  if (surl.indexOf('wr.jsp') > -1)
   ifcache = true;
  var ww1 = 46;
  var hh1 = 46;
  if (galx == 8) {
   ww1 = 105;
   hh1 = 104;
  }
  ;setTimeout(function() {
   if (db.ifjp == 1) {
    j().getdiv('ajax-loader', null, 'ajax-loader.png', ww1, hh1, j().getsl() + j().getcw() * 0.5 - ww1 * 0.5, j().getst() + j().getch() * 0.5 - hh1 * 0.5, 999100, '');
    j('#ajax-loader').click(function() {
     j('#ajax-loader').hide();
    });
   }
  }, 1000);
  var stype = "get";
  if (sdata) {
   stype = "POST";
   sdata += '&decode2=1';
  } else {
   sdata = '';
  }
  j.ajax({
   type: stype,
   async: true,
   url: surl,
   dataType: "jsonp",
   data: encodeURI(sdata),
   jsonp: "callbackparam",
   jsonpCallback: "jpn",
   success: function(json) {
    db.ifjp = 0;
    j('#ajax-loader').hide();
    if (json.upd) {
     if (json.upd[0]) {
      if (json.upd[0].res.indexOf('erxxror') > -1) {
       var ifreturn = 1;
       sres = json.upd[0].res.replace(/erxxror/gi, '对不起。');
       if (sres.indexOf('nore') > -1 || jg_aj.ssurl.indexOf('nore') > -1)
        ifreturn = 0;
       sres = json.upd[0].res.replace(/erxxror/gi, '对不起。').replace(/nore/gi, '');
       db.jalerte(sres);
       if (ifreturn)
        return;
      }
     }
    }
    if (surl.indexOf('mordata=us,vs') > -1 || surl.indexOf('mordata=vs') > -1)
     db.showidus('', json);
    if (surl.indexOf('merge=no') == -1)
     json = db.merge(json, argj);
    db.dofunc(func, json);
   },
   error: function(XMLHttpRequest, textStatus, errorThrown) {
    j('#ajax-loader').hide();
    sres = '';
    if (textStatus == 'parsererror')
     sres = '数据格式不匹配！';
    if (textStatus == 'notmodified')
     sres = '没有新数据！';
    if (textStatus == 'timeout')
     sres = '网络不给力，连接超时了！';
    if (textStatus == 'error') {
     sres = XMLHttpRequest.readyState + '网络不给力！' + XMLHttpRequest.status;
    }
   }
  });
 }
 ;
 this.alerta = function(aRco) {
  ui.ui.all['aaqyev'].cfun = '';
  ui.ui.all['aaqyev'].ca = '确定|j().cls();`取消|j().cls();';
  var aN4 = j(db.sj['rw'].all).jgrepa('rco', aRco, 'cn4');
  j().jalert('<div style="color: rgb(213, 231, 120);font-size: 18px;width: 332px;margin-top:20px;">尊敬的客户，您即将购买的是：<br/>游戏名：后宫掌心计<br/>道具名：' + db.sj['tc@rwp@rw'].all[db.sj['rwp@rw'].all[aRco].lxtc].ctn + '<br/>道具数量：1<br/>服务提供商：****<br/>资费说明：' + aN4[1].replace('-', '') + '金元宝（即消费' + (aN4[1].replace('-', '') * 0.1) + '.0元人民币）<br/>点击确定按钮确认购买，中国移动！<br/>' + j().geta(ui.ui.all["aaqyev"]) + '</div>', null, {
   ifms: '-2',
   titl: '友情提示',
   ifgb: '-2'
  });
 }
 ;
 this.addhtm = function(fn, ifjs, uri, json) {
  ifjs = ifjs || '1';
  if (uri == undefined) {
   uri = '?ifjs=' + ifjs;
  } else {
   uri += '&ifjs=' + ifjs;
  }
  j('#jg-0').attr('uri', fn + '.html' + uri);
  db.curh++;
  if (db.curh == 10)
   db.curh = -1;
  db.historya[db.curh] = fn + '.html' + uri;
  if (fn == 'h') {
   showzy();
   return;
  }
  if (j('[fn="' + fn + '"]').length == 1 && fn != 'abcmx') {
   if (ifjs != '2')
    hidediv(fn);
   if (json || ifjs != '1' && ifjs != '2') {
    showdiv();
   } else {
    window.setTimeout("db.geval('" + fn + "')", 40);
   }
   return;
  }
  var divid = 'jg-' + db.curdiv;
  if (j('#' + divid).length == 0) {
   db.curdiv = 1;
   divid = 'jg-1';
  }
  if (j('#' + divid).attr('fn') == 'wnew') {
   db.curdiv++;
   divid = 'jg-' + db.curdiv;
   if (j('#' + divid).length == 0) {
    db.curdiv = 1;
    divid = 'jg-1';
   }
  }
  j('#' + divid).attr('fn', fn);
  if (json) {
   j().getall(json.str, divid, fn, {
    sqajax: json.sqajax || fn,
    swhe: json.swhe || '',
    func: json.func
   }, json.tablename || '', json.st || '', json.sid || '', json.dragdiv || '', json.isappend);
  } else {
   j('#' + divid).html(db.htma[fn]);
   if ((ifjs || '1') != '2')
    hidediv(fn);
   window.setTimeout("db.geval('" + fn + "')", 40);
  }
  db.curdiv++;
 }
 ;
 this.geval = function(fn) {
  if (eval('(window.dojs_' + fn + ')?1:0') == 1) {
   eval('dojs_' + fn + '()');
  } else {
   j.globalEval(db.htma['js' + fn]);
  }
 }
 ;
 this.gethtm = function(fn, ifjs, json) {
  if (window.showdiv == undefined) {
   window.location = fn;
  }
  var fna = fn.split('.html');
  fn = fna[0];
  if (json) {
   db.addhtm(fn, ifjs, fna[1], json);
   return;
  }
  if (db.htma[fn]) {
   db.addhtm(fn, ifjs, fna[1]);
   return;
  }
  db.gajax('' + fn + '.html', function(htm) {
   ha = htm.split('<body')[1].split('<script>');
   iks = ha[0].indexOf('>');
   db.htma[fn] = ha[0].substring(iks + 1);
   db.htma['js' + fn] = ha[1].split('</script>')[0];
   db.addhtm(fn, ifjs, fna[1]);
  });
 }
 ;
 this.gajax = function(surl, func, data) {
  var data = data || {};
  if (typeof (func) == "string") {
   j.ajax({
    url: surl,
    dataType: 'text',
    cache: false,
    success: function(data) {
     eval(func);
    }
   }).error(function() {});
  } else {
   if (window.OpSphinx) {
    var payObj = new OpSphinx();
    payObj.invoke("test", surl, func);
   } else {
    if (windowjs == 1 && lurl.indexOf('http') != 0) {
     func(window.js.getf(surl));
    } else {
     j.ajax({
      url: surl,
      type: (j.isEmptyObject(data) ? "GET" : "POST"),
      dataType: 'text',
      data: data,
      cache: false,
      success: func
     }).error(function(XMLHttpRequest, textStatus, errorThrown) {
      if (surl.indexOf('ifgs.txt') > -1) {
       db.dofunc(func, '');
      } else {
       alert(textStatus + errorThrown + surl);
      }
     });
    }
   }
  }
 }
 ;
 this.merge = function(json, argj) {
  if (db.sj == null) {
   db.sj = json;
  } else {
   j.each(json, function(i, n) {
    if (db.sj[i] == null) {
     db.sj[i] = n;
    } else {
     if (typeof (n) != 'string' && typeof (n) != "number")
      j.each(n, function(ii, nn) {
       if (typeof (nn) == "string") {
        var a = 1;
        db.sj[i][ii] = nn;
       } else {
        if (db.sj[i][ii] == null) {
         db.sj[i][ii] = nn;
        } else {
         if (nn.sx) {
          if (db.sj[i][ii].sx) {
           j.each(nn.sx, function(iii, nnn) {
            var dbsxStr = "," + db.sj[i][ii].sx.toString() + ",";
            if (dbsxStr.indexOf(',' + nnn + ',') == -1) {
             db.sj[i][ii].sx.push(nnn);
            }
           });
          } else {
           db.sj[i][ii].sx = nn.sx;
          }
         }
         j.each(nn, function(iii, nnn) {
          if ((i + '').indexOf('upd') == -1) {
           if (argj)
            if (argj[i]) {
             if (argj[i] == 1) {
              if (db.sj[i][ii][iii] != null) {
               delete nn[iii];
              }
             }
            }
          }
          db.sj[i][ii][iii] = nnn;
         });
        }
       }
      });
    }
   });
  }
  return json;
 }
 ;
 this.geturi = function(t, rid) {
  var stemp = '';
  j('[t="' + t + '"][rid="' + rid + '"]').each(function() {
   en = j(this).attr('en');
   if (en) {
    stemp += '&' + en + "=" + j(this).vale() + "";
   }
  });
  return encodeURI(stemp.substring(1));
 }
 ;
 this.encode = function(str, f) {
  if (f) {
   str = str.replace(/\n/g, '<BR>').replace(/"/g, '``').replace(/#/g, '＃').replace(/&/g, ';amp;');
  } else {
   str = str.replace(/\n/g, '<BR>').replace(/"/g, '``').replace(/#/g, '＃').replace(/&/g, ';amp;').replace(/'/g, '\\\'');
  }
  return encodeURI(str).replace(/\+/g, '%2b');
 }
 ;
 this.qx = function(showf, cidus) {
  var sms = '';
  var dbidus = db.idus || window.idus;
  if (dbidus < 1000) {
   sms = "您尚未登录！";
  } else {}
  if (cidus) {
   if (cidus != dbidus)
    sms = "这不是属于您的，无法操作!";
  }
  if (showf == 1 && sms)
   funalert(sms, '', 6);
  return sms;
 }
 ;
 this.sajax = function(t, q, w, a, func, arg, notqx) {
  if (notqx == null)
   if (db.qx(1) != '')
    return;
  arg = arg || '&option=001';
  var s = '';
  var ta = t.split('|');
  var qa = q.split('|');
  var wa = w.split('|');
  var aa = a.split('|');
  j.each(qa, function(i, n) {
   if (ta.length > i)
    s += '&t' + i + '=' + ta[i];
   s += '&q' + i + '=' + db.encode(qa[i], 1).replace(/\=/g, '7fs39').replace(/\,/g, '7g2j9');
   if (wa.length > i)
    s += '&w' + i + '=' + encodeURI(wa[i]).replace(/\+/g, '%2b');
   if (aa.length > i)
    s += '&a' + i + '=' + aa[i];
  });
  var url = 'db.jsp?idpg=' + idpg + '&n=' + qa.length + s + arg;
  var data = "";
  if ((window.location + '').indexOf(domain) == 7 && (window.location + '').indexOf('urltypeget') == -1) {
   data = 'idpg=' + idpg + '&n=' + qa.length + s + arg;
   url = 'http:\/\/' + (window.domain) + '/db.jsp';
  }
  //db.jp(url, func, {}, data);
 }
 ;
 this.dofunc = function(func, json) {
  if (typeof (func) == "string") {
   eval(func);
   return;
  }
  if (typeof (func) == "function") {
   var a = new Array();
   if (typeof (json) == "string")
    json = eval(json.replace(/jpn/, ''));
   a[0] = json;
   j.each(a, func);
  }
 }
 ;
 this.sqajax = function(json, cid, repl, func, arg, notqx) {
  if (notqx == null)
   if (db.qx(1) != '')
    return;
  if (1 == 1) {
   var tidcm = jg_aj.tidcm || '';
   var idcm = idcm || '';
   var url = 'db.jsp?cid=' + cid + '&idpg=' + idpg + '&idcm=' + (jg_aj.idcm || idcm || '') + '&tidcm=' + tidcm;
   if (arg)
    url += arg;
   if (navig.ie) {
    srepl = db.obj2str(repl)
   } else {
    srepl = JSON.stringify(repl);
   }
   if (typeof (json) == 'string')
    url += '&sqctn=' + json;
   srepl = srepl.substring(1, srepl.length - 1);
   url += '&repl=' + srepl;
   db.jp(url, func, {});
   return;
  }
 }
 ;
 this.obj2str = function(o) {
  var r = [];
  if (typeof o == "string")
   return '"' + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
  if (typeof o == "undefined")
   return "undefined";
  if (typeof o == "object") {
   if (o === null)
    return "null";
   else if (!o.sort) {
    for (var i in o)
     r.push('"' + i + '"' + ":" + db.obj2str(o[i]));
    r = "{" + r.join() + "}";
   } else {
    for (var i = 0; i < o.length; i++)
     r.push(db.obj2str(o[i]));
    r = "[" + r.join() + "]";
   }
   return r;
  }
  return o.toString();
 }
 ;
 Object.defineProperty(Array.prototype, "unique", {
  value: function() {
   this.sort();
   var re = [this[0]];
   for (var i = 1; i < this.length; i++) {
    if (this[i] !== re[re.length - 1]) {
     re.push(this[i]);
    }
   }
   return re;
  },
  enumerable: false
 });
 this.dbajax = function(strt, rid, func, arg, notqx) {
  if (notqx == null)
   if (window.tk)
    if (tk.qx(1) != '')
     return;
  var s = '';
  var idx = 0;
  j.each(strt.split('|'), function(i, t) {
   var rida = j('[t="' + t + '"][begineditf="1"]').vale('rid').split(',').unique();
   j.each(rida, function(ii, nn) {
    var stemp = '';
    var ifall = 1;
    j('[t="' + t + '"][rid="' + nn + '"]').each(function() {
     var en = j(this).attr('en');
     if (j(this).attr('begineditf') == '1') {
      if (en) {
       var vel = j(this).vale();
       if (db.getft(en) == 'number' && en != 'aid') {
        stemp += ',' + en + "=" + vel + "";
       } else {
        stemp += ',' + en + "='" + db.encode(vel) + "'";
       }
      }
     } else {
      if (en != 'xuhao' && en != 'id')
       ifall = 0;
     }
    });
    var q_hz = '';
    var w_hz = '';
    if ((window.location + '').indexOf(domain) == -1 && ifall == 1) {
     if (t.split('@')[0] == 'tj') {
      w_hz = ' and f1=-3';
      q_hz = ',f1=1';
     } else {
      s += '&a' + idx + '=1';
     }
    }
    if (((nn + '').indexOf('nr') == 0 || arg.indexOf('&ifnr=nr') > -1) && t.split('@')[0] == 'tj')
     s += '&a' + idx + '=3';
    var strq = (stemp.substring(1) + q_hz);
    if (strq.length > 2) {
     s += '&q' + idx + '=' + strq;
     if (nn.indexOf('nr') != 0 && arg.indexOf('&ifnr=nr') == -1)
      s += '&w' + idx + '=id=' + nn + w_hz;
     s += '&t' + idx + '=' + t.split('@')[0].split('_')[0];
     idx = idx + 1;
    }
   });
  });
  if (arg)
   s += arg;
  var url = 'http:\/\/' + (window.domain) + '/db.jsp?idpg=' + idpg + '&idcm=' + (jg_aj.idcm || '') + '&tidcm=' + (jg_aj.tidcm || '') + '&n=' + (idx) + s;
  var data = "";
  if ((window.location + '').indexOf(domain) == 7) {
   data = 'idpg=' + idpg + '&n=' + (idx) + s;
   url = 'http:\/\/' + (window.domain) + '/db.jsp';
  }
  db.jp(url, func, {}, data);
 }
 ;
 this.getft = function(fieldname) {
  if (fieldname.indexOf('c') == 0)
   return 'char';
  if (fieldname.indexOf('date') > -1)
   return 'date';
  return 'number';
 }
 ;
 this.getrd = function(n) {
  var rad = ''
      , sj = 13;
  for (var i = 0; i < n; i++) {
   if (i == 0) {
    sj = Math.floor(Math.random() * 104) % 52;
   } else {
    sj = Math.floor(Math.random() * 124) % 62;
   }
   rad += db.strzm.substring(sj, sj + 1);
  }
  return rad;
 }
 ;
 this.getnrid = function() {
  return ('nr' + Math.random() * 999999).split('.')[0];
 }
 ;
 this.ldb = '';
}
;function dl() {
 this.hasdl = 0;
 this.checkupd = function() {
  if (windowjs) {
   window.js.ini(-1);
  } else {
   window.location = j().getUrl('v', Math.random());
  }
 }
 ;
 this.getdata = function() {
  window.js.ini(1);
  j('#xztishi').show();
 }
 ;
 this.getall = function() {
  window.js.ini(9);
  j('#xztishi').show();
 }
 ;
 this.sysrep = function() {
  if (window.js) {
   window.js.ini(3);
   j().jalert('已发出修复指令，请不要重复提交！稍后 再按：重试');
  }
  ;
 }
 ;
 this.delcyt = function() {
  if (window.js) {
   j().jalert('正在删除缓存');
   window.js.delcyt();
   j().jalert('已删缓存，重启游戏后会重新初始化和更新文件。');
  }
  ;
 }
 ;
 this.reflesh = function() {
  if (windowjs) {
   var htmln = 'dl';
   if (galx != 7)
    htmln = 'dl' + galx;
   window.js.httpurl('wv2', htmln + '.html?usfrom=' + usfrom + '&' + Math.random() + '&aid=' + j().getv('aid', ''));
  }
 }
 ;
 this.reinfo = function() {
  j("#guidemishu").hide();
  dl.reflesh();
 }
 ;
 this.logouta = function(func) {
  if (db.sj.us.all[db.idus].qq == 0 && db.sj.vs.all[db.idus].ctel == "" && galx != 8 && idpg != 18181 && db.sj.vs.all[db.idus].s8 > 0 && db.us.all[db.idus].team == 0) {
   j().jalert("为方便下次登录，请完善您的QQ（登录账号）和手机号码！", null, {
    clas: "ui3b",
    ifms: -2
   });
   return;
  }
  db.jp('http:\/\/' + window.domain + '/login.jsp?galx=7&idpg=-98&cem=logout', function(json) {
   if (json.upd)
    if (json.upd[0].res) {
     if (json.upd[0].res.indexOf('成功') == -1) {
      j().jaler(json.upd[0].res);
      return;
     }
    }
   if (typeof (func) != "undefined") {
    db.dofunc(func, {});
   } else {
    db.idus = 1;
    dl.builddl();
    j("#loginfo").html('');
    j().cls('zhbinfo');
    j().cls('ggk');
   }
  });
 }
 ;
 this.zhmm = function() {
  var cem = j('#fpw_qq').val();
  if (cem == '') {
   j().jalert('请先输入你绑定的qq号或邮箱');
   j('#fpw_qq').focus();
   return;
  }
  db.sajax('us@3', "all", (cem.indexOf('@') > 0) ? "cem='" + cem + "'" : "qq=" + cem, '', function(i, json) {
   if (json['us@3'].a.maxr == 1) {
    j().jaler('<div style="height:50px;width:90%;margin-top:37px;">确定将重置密码发到邮箱' + cem + "吗？</div>", null, "重置密码|dl.zhmma(" + j(json['us@3'].all).topr(0).id + ")");
   } else {
    j().jalert('没有找到' + cem + '相关用户');
   }
  }, '&option=011', 1);
 }
 ;
 this.zhmma = function(usid) {
  db.jp("email.jsp?cti=您在开心推的密码&idus=" + usid, function(ii, jsona) {
   j().jalert('已发到邮箱！有可能被错误的归在垃圾邮件中。');
  });
 }
 ;
 this.swich360 = function() {
  if (windowjs == 1) {
   window.js.swich3();
   j('.dltop').html('自动登录中');
  }
 }
 ;
 this.reg = function(tdid, clas) {
  var ocem = j('[t="us"][en="cem"]').vale();
  var ocpw = j('[t="us"][en="cpw"]').vale();
  var tdid = tdid || "ltd1";
  var rid = db.getnrid();
  var clas = clas || 'dl';
  if (clas == 'undefined')
   clas = '';
  var zck = '<div><div class="' + clas + 'top" style="margin-bottom:-5px;"></div><div class="' + clas + 'zh"><div style="width:320px"><br><br><div style="height:51px;width:192px;background:url(/css/yhdeg.png) no-repeat;margin-bottom:35px"></div>';
  if (galx == 8) {
   zck += grid.inp('us', 'cem', '您的手机', rid, (ocem.indexOf('@') > 0 ? ocem : ''), "input2 r");
  } else {
   zck += grid.inp('us', 'qq', '您的QQ或手机(选填)', rid, (ocem.indexOf('@') > 0 ? '' : ocem), "input2 r") + '' + grid.inp('us', 'cem', '您的邮箱(选填)', rid, (ocem.indexOf('@') > 0 ? ocem : ''), "input2 r");
  }
  zck += '' + grid.inp('us', 'cpw', '设置密码', rid, (ocpw), "input2 r");
  zck += '<br>' + '</div><table align="center"><tr><td> </td><td class="cent"><div id=btnzhuce class=clearfix>' + j().ui({
   cid: 'btnzhuce',
   ca: "返回|dl.builddl('" + clas + "')`注册|",
   class0: (galx == 9 ? "_f_18__200 cent _r_5__ff7878_1 x_c_rede" : "x_c_gray _f_22 cent _r_5__bbb")
  }) + '</div>' + ((galx == 9 && window.location.host.indexOf("kxtui") > -1) ? '<br><a href="/g/www/yhxy.html" target="_blank" style="color:#2f90e1;text-decoration: underline;">阅读开心推注册协议</a>' : '') + '</td></tr></table></div><div class="' + clas + 'bot"></div></div>';
  j("#" + tdid).html(zck);
  if (usfrom.indexOf('ios') > -1) {
   j('td:contains("或邮箱：")').html("您的邮箱：");
   j('td:contains("您的QQ：")').closest('table').hide();
  }
  j("#fhsyb_0_0").css({
   'line-height': '65px'
  });
  j('[t="us"][en="cem"]').click(function() {
   sqq = j('[t="us"][en="qq"]').vale();
   if (sqq != "")
    j('[t="us"][en="cem"]').val(sqq + "@qq.com");
  });
  j('#btnzhuce_1').click(function() {
   var scem = j('[t="us"][en="cem"]').vale();
   sqq = j('[t="us"][en="qq"]').vale();
   var scpw = j('[t="us"][en="cpw"]').vale();
   if (sqq != "")
    if (parseInt(sqq || 0) < 10000) {
     j().jalert('qq格式不对！');
     return;
    }
   var a = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}$/;
   if (scem == "") {
    if (sqq != "")
     j('[t="us"][en="cem"]').val(sqq + "@qq.com");
   } else {
    if (scem.indexOf('@') == -1 && !scem.match(a)) {
     j().jalert('手机或邮箱格式不对！');
     return;
    }
   }
   if (scem == "" && sqq == "") {
    if (usfrom.indexOf('ios') > -1) {
     j().jalert('邮箱必须填！');
     return;
    }
    j().jalert('邮箱和qq必须填一个！');
    return;
   }
   if (scpw.length > 15) {
    j().jalert('密码位数过长，密码长度限制为15位以内！');
    return;
   }
   var cbd = '';
   if (windowjs)
    if (window.js.getbd)
     cbd = '&cbd=' + window.js.getbd();
   if (db.idus > 1000) {
    if (db.sj.vs.all[db.idus].cnt || db.us.all[db.idus].qq || (db.us.all[db.idus].cem.indexOf('@gzggo.com') == -1 && db.us.all[db.idus].cem.indexOf('@kxtui') == -1) || db.sj.vs.all[db.idus].ctel || db.us.all[db.idus].mb) {} else {
     db.sajax('us', 'qq=' + sqq + ",cem='" + scem + "',cpw='" + j('[t="us"][en="cpw"]').vale() + "'", 'id=' + db.idus, '', function(i, json) {
      dl.funregok(json);
     });
     return;
    }
   }
   db.jp('/login.jsp?idpg=-98&op=reg&aid=' + j().getv('aid', '') + cbd + '&tidus=' + j().getv('tidus', '') + '&usfrom=' + usfrom + '&cbid=&' + db.geturi('us', rid), 'dl.funregok(json)');
  });
 }
 ;
 this.autoreg = function(func) {
  db.jp('/login.jsp?idpg=-98&op=reg&aid=' + j().getv('aid', '') + '&tidus=' + j().getv('tidus', '') + '&usfrom=' + usfrom + '&cbid=&qq=&cem=' + db.getrd(6) + '@' + domain, function(i, json) {
   db.merge(json.sj);
   db.showidus(function() {
    if (func)
     db.dofunc(func, '');
   }, json.sj);
  });
 }
 ;
 this.funregok = function(json) {
  if (json.upd)
   if (json.upd[0].res) {
    if (json.upd[0].res.indexOf('成功') == -1 && json.upd[0].res.indexOf('ok') == -1) {
     j().jaler(json.upd[0].res);
     return;
    }
   }
  setTimeout(function() {
   var reurl = window.location + '';
   if (galx == 8) {
    reurl = reurl.replace("61c.jsp", "61.jsp");
    reurl = j().getUrl('idpgyey', j(json.sj.pp.all).topr(0).idpg, reurl);
   }
   reurl = j().getUrl('logint', db.gett(), reurl);
   var strcfun = j().getv('cfun', '');
   reurl = j().getUrl('cfun', '', reurl);
   if (strcfun == 'dl.build()') {
    ga.gobbs();
   } else {
    window.location = reurl;
   }
  }, 1000);
 }
 ;
 this.builddl = function(clas) {
  j('#guideggk').remove();
  j('#guidezhbinfo').remove();
  if (db.idus > 1000) {
   j("#divmain").html('');
   j('#main').show();
   j("#loginfo").html((db.us.all[db.idus].cnn || db.us.all[db.idus].qq) + '已登录');
   if (galx == 7) {
    dl.buildbtn();
   } else {
    if (window.mainfun)
     mainfun();
   }
   if (windowjs == 1) {
    if (lconf[0] == 1) {
     j('#aalogin').show();
     j('#aalogin1').hide();
     j().adh({
      'aalogin': 'd'
     });
    } else {
     j('#aalogin1').show();
     j('#aalogin').hide();
     j().adh({
      'aalogin1': 'd'
     });
    }
   }
  } else {
   if (j('#aalogin').length == 0) {
    dl.build(clas);
    j(document).scrollTop(0);
    return;
   }
   dl.getlogin("divmain");
  }
  var str3 = '';
  if (sj['cm'])
   j.each(sj['cm'].all, function(i, n) {
    str3 += '' + n.ctn + '<br>';
   });
  if (galx == 7)
   if (usfrom == '360' || usfrom == '' || usfrom == 'uc')
    j().jalert('<div class="opa r5 yaheif wei16" style="padding:0 16px;">' + str3 + '</div>', null, {
     clas: 'zhbinfo',
     titl: '公告',
     ifms: '-2'
    }, (j().getcw() - 480) * 0.5, 120);
 }
 ;
 this.build = function(clas, gjson, op) {
  gjson = gjson || {};
  var cemtitl = gjson.cemtitl || '手机、QQ或邮箱';
  var op = op || 0;
  var rid = db.getnrid();
  var divid = "guide0";
  var dlk = '<div onclick=j().cls("0") style="height:51px;width:192px;background:url(/css/yhdl.png) no-repeat;margin-top:35px;margin-bottom:35px"></div><div id=idussdiv style="width:380px;" >' + '</div>' + (lurl.indexOf("kxtui.") == -1 ? '' : ('<div style="width:380px;height:50px;border-top:1px solid #333">其他帐号登录：</div><div class="clearfix" style="width:380px;min-height:50px;">' + j().ui({
       cid: 'yjdlbtn',
       s: 0,
       marg: 15,
       ca: "<img src='/css/dlqq.png' width='100%'/>|dl.dlthird1('openqq')`<img src='/css/dlwx.png' width='100%'/>|dl.dlthird1('openwx')`<img src='/css/dlwb.png' width='100%'/>|dl.dlthird1('openwb')",
       w: 60,
       h: 60,
       class0: '_f_18__200 cent _r_9__ccc_1 x_b___000_ccc_ccc_000'
      }) + '</div>'));
  if (clas && clas != '0') {
   divid = "msg_" + clas;
  } else {
   clas = 0
  }
  j().jaler(dlk, 150, "", 1, clas || 0);
  if (op == 1)
   dl.reg(divid, "undefined");
  var sdfs = grid.inp('us', 'cem', cemtitl, rid, null, "input2 r") + '<div class="cent" style="color:#999;"></div>' + grid.inp('us', 'cpw', '登录密码', rid, null, "input2 r") + '' + j().ui({
       cid: 'divzhmm',
       z: -2,
       w: 79,
       h: 30,
       class0: 'x_c_gray _f_18 cent _r_8__999',
       ca: (galx == 8 ? "" : "极速注册|dl.reg('" + divid + "','" + clas + "')|`") + '找回密码|dl.showFindPassword()'
      }) + '<br><br> <div style="width:135px;height:50px;">' + j().ui({
       ca: "登录|dl.denglu('" + rid + "','')|",
       s: 0
      }) + '</div>';
  j('#idussdiv').html(sdfs);
  if (db.idus > 1000) {
   dl.buildqus();
  }
  if (window.buildxq) {
   if (db.sj.wf) {
    buildxq('xqudiv', 'dl.setxq');
    return
   }
   db.sajax('wf', "(type)all", "type>10 order by type desc", '', function(i, json) {
    buildxq('xqudiv', 'dl.setxq');
   });
  }
 }
 ;
 this.dlthird1 = function(key) {
  dl.dlthird({
   'ac': key
  });
 }
 ;
 this.dlthird = function(json) {
  var config = json || {};
  var idcm1 = json.idcm || -1;
  var appid = json.appid || "";
  var reuri = json.reuri || encodeURIComponent(window.location.href);
  var ac = json.ac || "openqq";
  var gourl = "/oauth/?ac=" + ac + "&appid=" + appid + "&idcm=" + idcm1 + "&r=" + reuri;
  window.location.href = gourl;
 }
 ;
 this.buildqus = function() {
  stridus = '<div style="background:url(/css/testtx.png?1) 50% 0%/120% no-repeat;height:80px;"></div><span class="b">' + (db.vs.all[db.idus].cnt || db.idus) + '</span>|dl.qhus(' + db.idus + ',' + (db.vs.all[db.idus].cnt ? 1 : 0) + ',' + db.vs.all[db.idus].id + ')';
  db.sajax('us@9|vs@9', "all:id|(idus)all", "wbid>0 and wbid=" + db.us.all[db.idus].wbid + '|idus in ({0})', '', function(i, json) {
   j.each(json['vs@9'].all, function(ii, nn) {
    if (nn.idus != db.idus)
     stridus += '`<div style="background:url(/css/testtx.png?1) 50% 0%/120% no-repeat;height:80px;"></div><span class="b">' + (nn.cnt || nn.idus) + '</span>|dl.qhus(' + nn.idus + ',' + (nn.cnt ? 1 : 0) + ',' + nn.id + ')'
   });
   j('#idussdiv').html('<div style="width:380px;" class=clearfix id=addusdiv>选择或添加关联帐号：</div><div class=clearfix style="min-height:120px;">' + j().ui({
    cid: 'yjdlbtn',
    s: 0,
    marg: 5,
    ca: stridus + "`<div style='background:url(/css/uppic.png) 50% 50%/108% no-repeat;height:80px;'></div><span class='b'>添加帐号</span>|dl.addus()",
    w: 80,
    h: 103,
    class0: '_f_14 cent _r_5__ccc_2 x_b___000_ccc_ccc_000'
   }) + '</div><div class="clearfix" style="width:135px;height:50px;padding-top:5px;margin-top: 20px;clear: both;">' + j().ui({
    ca: "退出|dl.logouta()|",
    s: 0
   }) + '</div>');
  });
 }
 ;
 this.addus = function() {
  var rid = db.getnrid();
  j('#addusdiv').html('<div class="fleft" style="width:220px">' + grid.inp('us', 'cem', '手机、QQ或邮箱', rid, null, "input2 r") + grid.inp('us', 'cpw', '登录密码', rid, null, "input2 r") + '</div>' + j().ui({
   ca: "确定<br>添加|dl.denglu('" + rid + "','addus')|",
   class0: 'cent x_c_rede _r_5__ff7878_1 _f_18',
   marg: 10,
   w: 79,
   h: 60,
   z: -2,
   s: 0
  }) + j().ui({
   ca: "&nbsp;&nbsp;找回密码|dl.showFindPassword()",
   class0: '',
   marg: 10,
   w: 79,
   h: 30,
   z: -2,
   s: 0
  }));
 }
 ;
 this.showFindPassword = function() {
  var userCenter = '<table style="margin-left:20%"><tr><td colspan="2" style="width: 100%"><div style="line-height:60px;height:60px;width: 260px;background:url(/g/2048/2048/grzx.png) no-repeat; " ></div></td></tr>';
  userCenter += '<tr ><td style="font-size: 18px;">请输手机号码：</td><td height="45px"><input type="text" id="fpw_ctel" value="" class="input2" /></td></tr>';
  userCenter += '<tr ><td style="font-size: 18px;">或输入QQ帐号：</td><td height="45px"><input type="text" id="fpw_qq" value="" class="input2" /></td></tr>';
  userCenter += '<tr ><td style="font-size: 18px;">请输验证码：</td><td height="45px"><input type="text" id="fpw_yymm" value="" class="input2" /></td></tr>';
  userCenter += '<tr ><td colspan="2"><img src="" id="fpw_img" onclick=dl.changeValit("fpw_img") /></tr>';
  userCenter += '<tr style="height:30px;"><td colspan="2"><div id="fpw_tip" style="color:red" class="_f_18 center"></div></tr>';
  userCenter += '</table>';
  j().jaler(userCenter, null, "切换登录|dl.build();j().cls('ggk')|`密码找回|dl.findPassword()|");
  dl.changeValit("fpw_img");
 }
 ;
 this.changeValit = function(imgid) {
  j("#" + imgid).attr('src', '/gvalitpng.jsp?dt=' + db.gett());
 }
 ;
 this.findPassword = function() {
  j("#fpw_tip").html('');
  var qq = j("#fpw_qq").val();
  var valcode = j("#fpw_yymm").val();
  var ctel = j("#fpw_ctel").val();
  if (valcode == "") {
   j("#fpw_tip").html('请输入验证码');
   return;
  }
  if (ctel != "") {} else if (qq != "") {
   dl.zhmm();
   return;
  } else {
   j("#fpw_tip").html('请输入手机号码或QQ号码');
   return;
  }
  if (j().IsMobileNum(ctel) == 0) {
   j("#fpw_tip").html("请输入正确的手机号码");
   return;
  }
  j.ajax({
   type: "GET",
   url: "/gsendSms2.jsp?rdStr=" + valcode + "&op=100&qq=" + qq + "&teln=" + ctel,
   dataType: "text",
   success: function(data) {
    j("#fpw_tip").html(data);
    if (data.indexOf("新密码") > -1) {
     j("div[id=tempbtn_1]").each(function() {
      if (j(this).html().indexOf('密码找回') > -1) {
       j(this).hide();
      }
     });
    }
    ;dl.changeValit("fpw_img");
   }
  });
 }
 ;
 this.addusok = function(json) {
  json.sj.t = db.gett();
  db.idus = 1;
  db.showidus(function() {
   if (json.upd[0].res.indexOf('成功') > -1) {
    dl.build();
   } else {
    j().jaler(json.upd[0].res);
   }
  }, json.sj);
 }
 ;
 this.savevs = function(idvs) {
  db.dbajax('vs', idvs, function() {
   window.location.replace(window.location);
  }, '');
 }
 ;
 this.qhus = function(id, ifnc, idvs) {
  if (!ifnc && j().getv('cfun', '') == 'dl.build()') {
   j().jaler('' + grid.inp('vs', 'cnt', '需要先设置昵称', idvs, null, "input2 r"), null, '确定设置|dl.savevs(' + idvs + ')');
   return;
  }
  if (id == db.idus) {
   dl.funregok({});
   return;
  }
  j('#addusdiv').append('正在切换，请稍等');
  db.jp('/login.jsp?idpg=-98&op=' + '&navig=&caid=' + j().getv('aid', '') + '&wbid=' + db.us.all[db.idus].wbid + '&id=' + id, 'dl.funregok(json)');
 }
 ;
 this.denglu = function(rid, op) {
  op = (op || '');
  db.jp('/login.jsp?idpg=-98&op=' + op + '&navig=&caid=' + j().getv('aid', '') + '&' + db.geturi('us', rid), 'dl.addusok(json)');
 }
 ;
 this.getlogin = function(divid) {
  if (usfrom != 'uc') {
   var rid = db.getnrid();
   var dlk = '<div class="dltop wei16 yaheif" style="margin-bottom:-5px;"></div><div ' + sclick + '="window.clearTimeout(timeswich360);" class="dlzh"><div style="width:320px;" >' + grid.inp('us', 'cem', '邮箱或qq', rid, null, "input2 r") + '<br>' + grid.inp('us', 'cpw', '登录密码', rid, null, "input2 r") + '<br>' + '</div><table align="center"><tr><td> <div >' + j().geta(ui.ui.all['regist']) + '</div></td><td><div id=loginok>' + j().geta(ui.ui.all['loginok']) + '</div></td></tr></table></div><div class="dlbot"></div>';
   j("#" + divid).html(dlk).show();
   if (usfrom.indexOf('ios') > -1) {
    j('td:contains("邮箱或qq：")').html("邮箱：");
   }
   j("#loginok").click(function() {
    db.jp('/login.jsp?idpg=-98&navig=&caid=' + j().getv('aid', '') + '&' + db.geturi('us', rid), 'dl.funregok(json)');
   });
  }
  if (usfrom != 'yd')
   timeswich360 = window.setTimeout('dl.swich360()', 1500);
 }
 ;
 this.setmod = function(obj) {
  lconf[0] = parseInt(j(obj).attr('i'));
  if (lconf[0] == 0) {
   j('#aalogin').hide();
   j('#aalogin1').show();
  } else {
   j('#aalogin').show();
   j('#aalogin1').hide();
  }
  window.js.savestr('lconf.js', 'var lconf=[' + lconf[0] + ',"' + lconf[1] + '"];domain="' + lconf[1] + '.cyt86.com";');
 }
 ;
 this.buildbtn = function(usid) {
  ui.ui.all['aalogin'].cfun = "[wv1]h.html?usfrom=" + usfrom + "&vb=" + j().getv('vb', '') + "&aid=" + aid + "&";
  if (usid) {
   ui.ui.all['aalogin'].cfun += "id=" + usid + "&";
  } else {
   dl.showactor();
  }
  var btnstr = 'aalogin,aalogin1,logout';
  if (usfrom != '360' && usfrom != '' && usfrom != 'uc')
   ui.ui.all['logout'].ca = '退出登录|dl.logouta()';
  if (usfrom.indexOf('ios') > -1) {
   ui.ui.all['aalogin'].ca = '开始游戏';
   j('#aalogin').width(170);
   btnstr = 'aalogin,logout';
  }
  if (db.us.all[db.idus].jfd > 0) {
   var jftime = db.us.all[db.idus].jfd;
   j().jalert('封号至' + j().getdatetime(jftime));
   return;
  }
  j().getaa(btnstr);
  j('#aalogin_1').removeAttr('href');
  j('#aalogin_1').attr(sclick, 'cz_ini()');
 }
 ;
 this.setxq = function(xq, obj) {
  if (xq == '001')
   xq = 'ver';
  j('#aalogino').hide();
  domain = xq + '.cyt86.com';
  var cbd = '';
  if (windowjs) {
   if (window.js.getbd)
    cbd = '&cbd=' + window.js.getbd();
   window.js.seturlhead('http:\/\/' + (domain) + '\/');
  } else if ((window.location + '').indexOf('dl.html') > -1) {
   window.location = 'http:\/\/' + (domain) + '\/dl.html';
   return;
  } else {
   window.location = j().getUrl('stdm', xq);
  }
  j('#divactor').html('');
  db.jp('login.jsp?cun=' + (db.us.all[db.idus].cun || db.us.all[db.idus].cem) + '&cnn=' + encodeURI(db.us.all[db.idus].cnn) + "&aid=" + aid + cbd, function(i, json) {
   if (json.upd[0].id < 1000) {
    j().jalert('无法自动初始化用户：' + aid + ' ' + domain);
    return;
   }
   db.getus("aid='" + aid + "'", function() {
    j('#aalogino').show();
    dl.buildbtn();
   });
   if (windowjs) {
    lconf[1] = xq;
    window.js.savestr('lconf.js', 'var lconf=[' + lconf[0] + ',"' + lconf[1] + '"];domain="' + lconf[1] + '.cyt86.com";');
   }
  });
 }
 ;
 this.addjs = function() {
  db.jp('login.jsp?cun=' + (db.us.all[db.idus].cun || db.us.all[db.idus].cem) + '&newjs=1&cnn=' + encodeURI(db.us.all[db.idus].cnn) + "&aid=" + aid, function(i, json) {
   if (json.upd[0].id < 1000) {
    j().jalert('无法自动初始化用户：' + aid + ' ' + domain);
    return;
   }
   db.getus("aid='" + aid + "'", function() {
    j('#aalogino').show();
    dl.buildbtn();
   });
  });
 }
 ;
 this.showactor = function() {
  ui.ui.all['actor'] = j().jcopy(ui.ui.all['reflesh']);
  ui.ui.all['actor'].ca = '';
  ui.ui.all['actor'].cid = 'actor';
  ui.ui.all['actor'].cfun = '';
  ui.ui.all['actor'].s = 5;
  str2 = "";
  var ni = 0
      , cni = 0;
  j.each(db.vs.all, function(i, n) {
   ui.ui.all['actor'].ca += '`' + n.cnt + '' + "|dl.startgame(" + i + ")";
   str2 += "<div style='height:30px;width:103px' class='wei16 yaheif fleft'>[" + n.lv + "级] VIP" + n.vip + " </div>";
   if (db.idus == n.idus)
    cni = ni;
   ni++;
  });
  if (aid == '') {
   j('#divactor').html('');
   return;
  }
  ui.ui.all['actor'].ca = ui.ui.all['actor'].ca.substring(1);
  j('#divactor').html("<div class='cent wei18 yaheif' onclick=''>请选择游戏角色 </div><div class=fleft style='margin-left:30px' id=actor>" + j().geta(ui.ui.all['actor']) + "</div><div style='clear:both;margin-left:30px' >" + str2 + "</div>").show();
  j('#actor_' + cni).checkd();
  j('#actor').son().children().css('height', 30);
 }
 ;
 this.startgame = function(usid) {
  db.jp('login.jsp?id=' + usid + "&aid=" + aid, function(i, json) {
   if (json.upd[0].id < 1000) {
    j().jalert('无法自动初始化用户：' + aid + ' ' + domain);
    return;
   }
   dl.buildbtn(usid);
  });
 }
 ;
 this.go2game = function(obj) {
  if (obj == undefined || j(obj).attr('i') == '0') {
   var surl = ui.ui.all['aalogin'].cfun.split(']')[1];
   window.js.go2(surl);
  }
 }
 ;
 this.ini1 = function() {
  if (window.lconf != undefined) {
   dl.ini2();
  } else {
   if (galx == 7) {
    window.lconf = [0, '005'];
    domain = '005.cyt86.com';
    window.js.savestr('lconf.js', 'var lconf=[' + lconf[0] + ',"' + lconf[1] + '"];domain="' + lconf[1] + '.cyt86.com";');
   }
   setTimeout('dl.ini2()', 1000);
  }
 }
 ;
 this.ini2 = function() {
  var xq = domain.split('.')[0];
  if (window.lconf != undefined) {
   xq = lconf[1];
   if (windowjs)
    window.js.seturlhead('http:\/\/' + (domain) + '\/');
   if (usfrom == 'yd' || usfrom.indexOf('ios') > -1) {
    lconf[0] = 1;
   } else {
    j().getaa('szmod');
    j('#szmod_' + lconf[0]).checkd();
   }
  }
  j('#readxqdiv').html(xq);
  dl.showcm();
 }
 ;
 this.showcm = function() {
  if (galx != 7) {
   db.setidus(function() {
    dl.builddl();
   });
   return;
  }
  if (j('#guidezhbinfo').length == 1)
   return;
  db.sajax('cm|wf', "all|(type)all", "idpg=-2|type>10 order by type desc", '', function(i, json) {
   if (window.buildxq)
    buildxq('xqdiv', 'dl.setxq');
   db.setidus(function() {
    dl.builddl();
   });
  }, '&option=011&setdomain=ver', 1);
 }
 ;
 this.inix = function(inixf) {
  inixf = inixf || 1;
  if (inixf == 1) {
   aid = j().getv('aid', '');
   usfrom = j().getv('usfrom', '');
   if (j().getcw() < 810)
    j('#loginbox').width('');
   j('#loginbox').height(Math.max(820, j().getch()));
   j().getaa('xfbtn,reflesh,dlupd');
   var cver = ver + '';
   if (windowjs)
    if (window.js.getver)
     cver = window.js.getver() + '';
   j('#vid').html("V1." + cver);
  }
  if (lurl.indexOf('http:') == 0) {
   dl.ini2();
  } else {
   if (j().getv('ret360', '') == '' && inixf == 1) {
    window.js.ini(-1);
    return;
   }
   if (usfrom.indexOf('ios') > -1) {
    iniwindowjs();
    document.getElementById("viewport").content = 'width=480,initial-scale=0.66, user-scalable=0';
    dl.ini1();
   } else {
    setTimeout(function() {
     if (j('#readxqdiv').html() == '')
      dl.ini1();
    }, 5000);
    db.gajax('360user.txt', function(shtm) {
     if (shtm.indexOf(',') > 0)
      if (db.gett() - parseInt(shtm.split(',')[1]) > 10 * 3590000) {
       j().jalert('请稍等，正在重新用' + usfrom + '帐号登录验证身份！');
       window.js.login3();
       return;
      }
     dl.ini1();
    });
   }
  }
 }
 ;
}
var dl = new dl();
function funydjf(i) {
 rco = 12010 + parseInt(i);
 j().jalert('购买成功了！');
}
function showdowninfo(str, divid, sjson, ffini) {
 var ss = '';
 var fsize = 0;
 if (str.indexOf('最新') > -1) {
  if (db.idus < 1000) {
   dl.inix(2);
   return;
  }
 }
 if (ffini != undefined) {
  if (sjson) {
   json = eval('(' + sjson + ')');
   j.each(json, function(i, n) {
    if (i != 'tjs' && i != 'tpng')
     fsize += n;
    if (i.indexOf('dl.js') > -1) {
     dl.hasdl = 1;
    }
   });
  }
  if (fsize > 0) {
   ss += '共计：' + (fsize / 1124000).toFixed(2) + 'M。';
   if (ffini == -9 || ffini == 9) {
    ss += '<input type=button value="确定全部重下载" onclick="window.js.ini(9);j(\'#xztishi\').show()">';
   } else {
    ss += '<div id="download" style="float:right;">' + j().ui({
     cid: 'download',
     z: -2,
     h: 26,
     w: 79,
     ca: '开始下载|dl.getdata()'
    }) + '</div>';
   }
  }
 }
 j('#downxx2').html(sjson);
 if (ss == '' && str.length < 3 || str.indexOf('最新') > -1) {
  ss = '已经是最新。' + j().geta(ui.ui.all['reinfo']);
  ui.ui.all['reflesh'].cfun = '';
  ui.ui.all['reflesh'].ca = '清后重启|dl.delcyt()';
  ss = (str + ss + '<div style="clear:both" class="wei18 yaheif">仍有问题请 清后重启，系统会重新初始化和检查更新。</div>' + j().geta(ui.ui.all['reflesh']) + '');
  j().jalert(ss, '', {
   ifgb: -1
  }, 40, 350);
  return;
 }
 if (divid == 'downxx') {
  bfa = str.split('|');
  str = bfa[0];
  if (bfa.length > 1)
   if (bfa[1] != '0')
    ss = ' : ' + bfa[1] + '%';
  j('#' + divid).html(str + ss);
  zs = parseInt(str.split('\/')[1]);
  var dbai = parseInt(str.split('/')[0]) / zs + bfa[1] * 0.01 * (1 / zs);
  w = j('.loadk').width() - 35;
  j('#downxx').css('background-size', w * dbai + 'px 30px');
  if (dbai == 1) {
   dl.reinfo();
   if (db.idus < 1000) {
    dl.ini1();
    return;
   }
  }
 }
 if (ffini != undefined) {
  if (db.downf == 1) {
   db.downf = 2;
   if (fsize > 0)
    if (fsize < 25 * 1024 && db.nw == 1 || fsize < 10 * 1024 && db.nw != 1) {
     window.js.ini(3);
     return;
    }
   if (fsize > 0)
    db.downf = 0;
  }
  if (db.downf == 0) {
   if (j('#guide').length == 1) {
    j('#guide').show();
   } else {
    var sdownxx1 = ''
        , sdownxx = '';
    if (divid == 'downxx1')
     sdownxx1 = str + ss;
    if (divid == 'downxx')
     sdownxx = str + ss;
    var sstr = '<span id=downxx1>' + sdownxx1 + '</span> <div style="display:" id=xznr><span style="display:none" id=xztishi>正全力更新中，请稍后!</span><br><br><div style="position:absolute;top:70px;z-index:2;height:30px; width:334px; margin:3px 0 0 9px" class="opa"><div class="yaheif cent wei16" style=" height:30px;background:no-repeat url(css' + (galx == 7 ? '' : galx) + '/loadt.png); background-size: 12px 30px;" id=downxx>' + sdownxx + '</div></div> <div class="loadk" onclick="j(\'#downxx2,#downxx3\').show()" style="position:absolute;top:70px;z-index:3; height:36px; width:369px; margin:0 0 0 -10px"></div></div>';
    if (j('#xztishi').length == 1) {
     j('#' + divid).html(str + ss);
    } else {
     j().jalert(sstr, '', {
      ifgb: -1,
      ifms: -2
     }, 40, 350);
    }
   }
  }
  db.downf = 0;
 }
 j('.zmxzh').html(db.downf + 'd' + fsize);
}
;function grid() {
 this.curr = 0;
 this.newtoptb = function(id, tdclas, strinner) {
  var w = j().getv('wid', '1200px');
  return '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td>&nbsp;</td><td id=' + id + '_t>' + '</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td width="' + w + '" class="' + tdclas + '" id=' + id + '>' + strinner + '</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td id=' + id + '_b>' + '</td><td>&nbsp;</td></tr></table>';
 }
 ;
 this.cwin = function(divid, p, bg, w, h, x, y, z, innerh, titl, classn, ww, ifgb, ifzz) {
  getdiv(divid, p, '', w, h, x, y, z, grid.rb(divid + '_d', 0, bg, h, '<div>' + titl + '</div>' + innerh, classn, ww, ifgb), '', '', 0, '');
  if (ifzz)
   funzhezao();
 }
 ;
 this.rb = function(tbid, i, bg, h, strinner, classn, ww, ifgb) {
  var bga = bg.split('-');
  var wb = ww || '9';
  var imgext = imgext || ".png";
  var strgb = '';
  if (ifgb)
   strgb = '<div style="float:right;margin-top:-15px;height:25px;width:26px">' + buildtb('gb_' + tbid, null, 'x/a26', 26, 25, 0, 0, 0, ' |hideobja("' + tbid.split('_')[0] + '");hideobja("zhezao")', 'xtb', 0, '') + '</div>';
  if (bga[1] == 1) {
   return "<table width=100% id=" + tbid + " border=0 cellpadding=0 cellspacing=0><tr><td height=" + h + "px width=" + wb + "px style='background:url(b/" + bga[0] + imgext + ")'></td><td style='background:url(b/" + bga[0] + "1" + imgext + ")' class='" + classn + "'>" + strinner + "</td><td width=" + wb + "px style='background:url(b/" + bga[0] + imgext + ") right'>" + strgb + "</td></tr></table>";
  }
  if (bga[1] == 3) {
   var strt = strb = strr = strl = '';
   return "<div id=r3c2" + tbid + "_" + i + " style='background:url(b/" + bga[0] + "1" + imgext + ") top;overflow:hidden;height:" + wb + "px;margin-left:" + wb + "px;margin-right:" + wb + "px'></div><div style='background:url(b/" + bga[0] + imgext + ") left top;overflow:hidden;height:" + wb + "px;width:" + wb + "px;float:left;margin-top:-" + wb + "px'></div><div style='background:url(b/" + bga[0] + imgext + ") right top;overflow:hidden;height:" + wb + "px;width:" + wb + "px;float:right;margin-top:-" + wb + "px'></div>" + "<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td width=" + wb + "px style='background:url(b/" + bga[0] + "2" + imgext + ")'>" + strr + "</td><td style='background:url(b/" + bga[0] + "0.png)' " + ((h == 0) ? "" : "height=" + (h - 2 * wb) + "px") + "><div class='" + classn + "' id=r2c2" + tbid + "_" + i + ">" + strgb + strinner + "</div></td><td style='width:" + wb + "px;background:url(b/" + bga[0] + "2" + imgext + ") right'>" + strl + "</td></tr></table><div id=r3c2" + tbid + "_" + i + " style='background:url(b/" + bga[0] + "1" + imgext + ") bottom;overflow:hidden;height:14px;margin-left:" + wb + "px;margin-right:" + wb + "px'></div><div style='background:url(b/" + bga[0] + imgext + ") left bottom;overflow:hidden;height:14px;width:" + wb + "px;float:left;margin-top:-14px'></div><div style='background:url(b/" + bga[0] + imgext + ") right bottom;overflow:hidden;height:14px;width:" + wb + "px;float:right;margin-top:-14px'></div>" + strb;
  }
 }
 ;
 this.newtb = function(id, tdclas, strinner, wtb, strinner1) {
  var wtb = wtb || '100%';
  var strnewtb = '<table class="' + tdclas + '" width="' + wtb + '" border=0 cellpadding=0 cellspacing=0 id=' + id + '><tr>';
  if (strinner1)
   strnewtb += '<td id=tdleft_' + id + ' valign="top">' + strinner1 + '</td>';
  strnewtb += '<td valign="top" style="border-left:1px solid #333" >' + strinner + '</td>';
  return strnewtb + "</tr></table>";
 }
 ;
 this.newhtb = function(id, tdclas, innera, strtr, wtb) {
  var wtb = wtb || '100%';
  var wtbs = wtb;
  if (wtb.indexOf('%') == -1)
   wtbs = wtb + 'px';
  var strnewtb = '<table width="100%" border="0px" cellpadding="0px" cellspacing="0px" ><tr id=' + id + '>';
  for (var i = 0; i < innera.length; i++) {
   var strw = '';
   if (i < innera.length - 1) {
    strw = 'width:' + (wtb / innera.length) + 'px';
    if (wtb.indexOf('%') > 0)
     strw = 'width:' + (100 / innera.length) + '%';
   }
   if (i == 0 && innera[i].indexOf('editallr') > 0)
    strw = 'width:40px';
   strnewtb += '<td class="gridtd ' + tdclas + '" style="' + strw + ';border-left:1px solid #aaa;border-top:1px solid #aaa;" onclick=inivi(this) valign="top">' + innera[i] + '</td>';
  }
  return strnewtb + "</tr>" + strtr + "</table>";
 }
 ;
 this.escedit = function(id, t) {
  j('[t="' + t + '"][en="xuhao"][rid="' + id + '"]').uncheckd();
  j('[t="' + t + '"][rid="' + id + '"][begineditf="1"]').css({
   'color': '#000',
   'background': '#fff'
  });
  j('[t="' + t + '"][rid="' + id + '"][begineditf="1"]').attr('begineditf', '0');
 }
 ;
 this.editallr = function(obj) {
  if (j(obj).ifcheck()) {
   j('.x_check[id="xh_0_1"]').each(function() {
    grid.editall(j(this).parent().parent().vale('rid'), j(this).parent().parent().vale('t'));
   });
  } else {
   j('.y_check[id="xh_0_1"]').each(function() {
    grid.escedit(j(this).parent().parent().vale('rid'), j(this).parent().parent().vale('t'));
   });
  }
 }
 ;
 this.editall = function(id, t) {
  j('[t="' + t + '"][rid="' + id + '"]').css({
   'color': '#000',
   'backgroundColor': '#FFFF99'
  });
  j('[t="' + t + '"][rid="' + id + '"]').attr('begineditf', '1');
  j('[t="' + t + '"][en="xuhao"][rid="' + id + '"]').children().checkd();
  j('[t="' + t + '"][en="xuhao"][rid="' + id + '"]').attr('begineditf', '0');
  j('[t="' + t + '"][en="xuhao"][rid="' + id + '"]').css({
   'backgroundColor': '#fff'
  });
  if ((t.split('@')[0]) == 'tj')
   j('[t="' + t + '"][en="id"][rid="' + id + '"]').attr('begineditf', '0');
  if ((t.split('@')[0]) == 'tj')
   j('[t="' + t + '"][en="id"][rid="' + id + '"]').css({
    'backgroundColor': '#fff'
   });
 }
 ;
 this.save = function(idmn, f, ifnr) {
  var strt = idmn;
  if (!isNaN(idmn)) {
   strt = db.sj.mn.all[idmn].ct;
   if (db.sj.mn.all[idmn].csq)
    strt += "|" + db.sj.mn.all[idmn].cq.replace(/,/gi, '|');
  }
  var lurl = (window.location + '');
  if (f) {} else {
   if (lurl.indexOf('http:') == 0)
    domain = window.location.host;
  }
  db.dbajax(strt, '', function(i, json) {
   if (json.upd[0].res == 'ok') {
    if (f) {
     okn = '';
     rida = rid.split(',');
     j.each(json.upd, function(i, n) {
      if (n.cont == 0)
       okn += ',' + rida[i];
      if (n.id)
       if (n.id != rida[i])
        okn += ',id错位' + n.id + '!=' + rida[i];
     });
     if (okn == '') {
      alert(rid + '保存到：' + domain);
     } else {
      alert('id=' + okn + '没有保存！');
     }
    } else {
     j.each(strt.split('|'), function(i, t) {
      var rid = j('[t="' + t + '"][begineditf="1"]').vale('rid');
      var rida = rid.split(',').unique();
      if (lurl.indexOf('grid') > -1)
       if (rid.indexOf('nr') > -1)
        window.location.replace(window.location);
      j.each(rida, function(i, n) {
       grid.escedit(n, t);
      });
     });
    }
    if (strt.indexOf('vi') > -1) {
     alert("VI表中如果涉及到新增加字段，需要在各个域名下保存一下，增加的数据，才能够在服务器上生效，数据才能够正常获取");
    }
   }
  }, '&option=01&ifnr=' + (ifnr || ''), 1);
 }
 ;
 this.xhclick = function(obj) {
  var rid = j(obj).parent().attr('rid');
  if (j(obj).ifcheck()) {
   this.curr = rid;
  } else {
   grid.escedit(rid, j(obj).parent().attr('t'));
   this.curr = 0;
  }
 }
 ;
 this.gettr = function(t, i, n, editm, c1, c2, ifxh, style) {
  var strxh = ''
      , strtr = '';
  if (ifxh) {
   strxh = "<td t=" + t + " en=xuhao rid=" + i + ">" + j().ui({
    cid: 'xh',
    class0: 'x_noy',
    ca: "|grid.xhclick(this)",
    w: 8,
    s: 0,
    h: 22,
    class1: 'x_check leftm',
    ncheck: 99
   }) + "</td>";
   if (editm == 2)
    strxh = "<td>" + i + "</td>";
  }
  strtr = grid.gettri(t, i, n, editm, c1, c2, ifxh, style);
  return '<tr t=' + t + ' cd=' + i + '>' + strxh + strtr + '</tr>';
 }
 ;
 this.retr = function(t, i, n) {
  j('tr[cd="' + i + '"][t="' + t + '"]').html(grid.gettri(t, i, n, 0, 0, 0, 0, 11));
 }
 ;
 this.gettri = function(t, i, n, editm, c1, c2, ifxh, style) {
  var jlmb = '';
  if (style == 0) {
   var s = '';
   var fa = sj[t].f.split(',');
   j.each(fa, function(ii, en) {
    if (ii >= c1 && ii < c2) {
     if (editm == 1)
      s += '<td ' + (galx == 8 ? "style='border-bottom:1px solid #dbdbdb;border-left:1px solid #dbdbdb;height:32px;text-align:center;'" : "") + '>' + grid.inp(t, en, '', i, n) + '</td>';
     var vl = n[en];
     if (en == 'modifyd' || en == 'created' || en == 'logind' || en == 'shouqud') {
      vl = j().getdatetime(vl);
     }
     if (editm == 2)
      s += '<td t=' + t + ' en=' + en + ' rid=' + i + ' class=' + (fa.length == (ii + 1) ? "td3" : "td2") + '>' + vl + '</td>';
    }
   });
   return s;
  }
  if (style > 10) {
   if (ifxh == 1)
    return '';
   if (t == 'co')
    return '<td>' + gettime(n.modifyd).split('月')[1] + code['rco'][n.rco] + ' ' + n.n0 + '币</td><td>' + n.n4 + '</td>';
  }
 }
 ;
 this.showrw = function(id) {
  parent.showobja('ltd3');
  parent.j("#bbbc").width(470);
  parent.j('#ltd3').html(getiframe('iltd3', 'w.jsp?t=rw&id=' + id));
 }
 ;
 this.inp = function(t, en, zw, rid, n, clsn, cid) {
  var clsn = clsn || "input2";
  var cid = cid || "";
  var v = (n ? (typeof (n) != 'object' ? n : n[en]) : '');
  var vl = v + "";
  var strv = '';
  var h = 22;
  if (clsn.indexOf(' r') > -1)
   h = 35;
  if (en == 'id' && t == 'vi@2')
   vl = rid;
  if (en == 'modifyd' || en == 'created' || en == 'logind' || en == 'shouqud') {
   vl = j().getdatetime(vl);
   strv = ' v=' + v;
  }
  if (cid != "") {
   cid = cid + en;
  }
  var str1 = "<input onfocus='grid.fover(this)' " + strv + " value='" + vl + "' type='" + (en.indexOf("cpw") == 0 ? "password" : ((typeof (n) == 'number' && en != 'modifyd' && en != 'created') ? "number" : "text")) + "' t='" + t + "' en='" + en + "' rid=" + rid + " style='box-sizing: initial;height:" + h + "px; line-height:" + h + "px; padding-left:3px;padding-right:2%;width:95%;" + (h > 30 ? "font-size:20px;" : "") + "' class='" + clsn + "' >";
  if (zw) {
   vl = ((vl + "").indexOf("gzggo.com") > -1 ? "" : vl);
   str1 = '<div style="position: relative;margin: 0 auto;">' + '<input ' + (cid == "" ? "" : ("id=" + cid)) + ' type="' + (en.indexOf('cpw') == 0 ? "password" : (en.indexOf('id') == 0 ? "tel" : ((typeof (n) == 'number' && en != 'modifyd' && en != 'created') ? "number" : "text"))) + '" autocomplete="off" onfocus=grid.fover(this) onblur=grid.offover(this) ' + strv + ' value="' + vl + '" type="' + (en.indexOf('cpw') == 0 ? "password" : (typeof (n) == 'number' ? "number" : "text")) + '" t="' + t + '" en="' + en + '" rid="' + rid + '" class="ui3inputclas" ' + ((zw == 'QQ' || zw == '更改密码' || zw == '昵称(企业名称)') ? 'style="padding: 10px 0px 10px 18px;"' : '') + '>' + '<span class="ui3spanclas" ' + sclick + '=grid.foveri(this) ondblclick="grid.dbfoveri(this)" style="color: #' + (vl == "" ? "999" : "12a5f8") + ';top: ' + (vl == "" ? 18 : -4) + 'px;">' + zw + '</span>' + '</div>';
  }
  if (en == 'cfun' && t == "fn" || (vl + "").indexOf("'") > -1 || (vl + "").indexOf("{") > -1 || (vl + "").indexOf("[") > -1) {
   str1 = '<div style="position: relative;margin: 0 auto;"><div contenteditable="true" onfocus="grid.fover(this)" ' + strv + ' t="' + t + '" en="' + en + '" rid="' + rid + '" style="height:' + Math.min(150, (vl.split('<BR>').length * 37)) + 'px; border: 1px solid #999;color: #333;font-size:12px;box-sizing: initial;padding-left:3px;padding-right:2%;width:95%;overflow:auto;margin: 10px 0 2px 0;text-align: left;" class="' + clsn + '" >' + vl.replace(/│/g, '|').replace(/\<BR\>/g, '\n').replace(/＃/g, '#').replace(/``/g, '"') + '</div><span class="ui3spanclas" onclick="grid.foveri(this)" ondblclick="grid.dbfoveri(this)" style="color: #12a5f8;top: -14px;background: url(/g/lining/css/white01.png);">' + zw + '</span></div>';
   if (lurl.indexOf("grid.jsp") > -1) {
    str1 = '<textarea onfocus="grid.fover(this)" ' + strv + ' t="' + t + '" en="' + en + '" rid="' + rid + '" style="height:' + Math.min(150, (vl.split('<BR>').length * 23)) + 'px; border: 1px solid #999;color: #333;font-size:12px;box-sizing: initial;padding-left:3px;padding-right:2%;width:95%;overflow:auto;" class="' + clsn + '" >' + vl.replace(/│/g, '|').replace(/\<BR\>/g, '\n').replace(/＃/g, '#').replace(/``/g, '"') + '</textarea>';
   }
  }
  return str1;
 }
 ;
 this.beginedit = function(obj) {
  var t = j(obj).attr('t');
  var en = j(obj).attr('en');
  var rid = j(obj).attr('rid');
  j('#btn' + t + '_1').show();
  if (db.sj.mn) {
   j.each(db.sj.mn.all, function(i, n) {
    if ((n.cq + ',').indexOf(t + ',') > -1)
     j('[onclick*="grid.save(' + i + ')"]').show();
   });
  }
  if (obj.className == 'input4') {} else {
   if (obj.style.backgroundColor != '#FFFF7E') {
    obj.style.backgroundColor = '#FFFF7E';
    j(obj).css({
     "background": "-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#FFFF7E))"
    });
   }
  }
  j(obj).attr('begineditf', '1');
  j('[t="' + t + '"][en="xuhao"][rid="' + rid + '"]').children().checkd();
  return true;
 }
 ;
 this.offover = function(obj) {
  var spant = j(obj).next().css('top');
  var inpval = j(obj).val();
  if (spant == '-4px' && inpval == "") {
   j(obj).next().css({
    'top': '18px',
    'color': '#999'
   });
  }
 }
 ;
 this.foveri = function(obj) {
  if (j("[t='editt'][en='tw']:input").length > 0) {
   if (j(obj).html() == "_id") {
    j("#s_codEBtn_3").html(j(obj).siblings("input").attr("rid")).css('color', '#000');
   }
  } else {
   grid.fover(j(obj).siblings("input"));
   j(j(obj).siblings("input")).focus();
  }
 }
 ;
 this.dbfoveri = function(obj) {
  if (j("[t='editt'][en='tw']:input").length > 0) {
   j("[t='editt'][en='tw']:input").val(obj.innerText + ":\/\/");
  } else {
   grid.fover(j(obj).siblings("input"));
   j(j(obj).siblings("input")).focus();
  }
 }
 ;
 this.fover = function(obj) {
  var spant = j(obj).next().css('top');
  if (spant == '18px') {
   j(obj).next().css({
    'top': '-4px',
    'color': '#12a5f8'
   });
  }
  crid = j(obj).attr('rid');
  j('#hx').css('top', j(obj).position().top + j(obj).height() + 3).show();
  j('#texta').val(j(obj).val());
  j('#texta').attr('finds', '[t="' + j(obj).attr('t') + '"][en="' + j(obj).attr('en') + '"][rid="' + crid + '"]');
  if (j(obj).attr('en') == 'id' && j(obj).attr('t') == 'pg@1') {
   window.open("grid.jsp?t=cm@1&waa0=idpg=" + j(obj).vale() + "%20order%20by%20modifyd%20desc&ft=&psize=200&idpg=21&editm=1&wid=100%", "_blank")
  }
  if (j("#divjedit").length > 0 && j("#pageTitle").length > 0 && j("#guideemp").css("display") != "none") {
   app.formatterToEditor();
  }
  if (this.curr > 0) {
   j('[t="' + t + '"][rid="' + crid + '"]').each(function() {
    en = j(this).attr('en');
    if (j(this).vale() != j('[t="' + t + '"][en="' + en + '"][rid="' + grid.curr + '"]').vale()) {
     j(this).css('color', 'red');
    }
   });
   j(obj).dblclick(function() {
    j('[t="' + t + '"][rid="' + crid + '"]').each(function() {
     en = j(this).attr('en');
     cv = j('[t="' + t + '"][en="' + en + '"][rid="' + grid.curr + '"]').vale();
     if (j(this).vale() != cv && en != 'id' && en != 'ctn') {
      grid.beginedit(this);
      j(this).val(cv);
     }
    });
   });
  }
  obj.onkeyup = function(e) {
   var sobjval = j(obj).vale();
   if (sobjval && sobjval.indexOf('##') >= 0 || sobjval.indexOf('···') >= 0 || sobjval.indexOf('```') >= 0) {
    grid.pastexls(obj);
   }
   if (j(obj).vale().indexOf('、、') >= 0)
    j(obj).val(j(obj).vale().replace('、、', '\/\/'));
  }
  ;
  obj.onchange = obj.onkeydown = function(e) {
   if (j().mye(e).ctrlKey == true && j().mye(e).keyCode == 86 || j().mye(e).ctrlKey == true && j().mye(e).keyCode == 88 || j().mye(e).ctrlKey != true) {
    if (grid.beginedit(this) == false)
     return false;
   }
   var t = j(obj).attr('t');
   var rid = j(obj).attr('rid');
   if (t == 'editt' && rid == 0) {
    if (j().mye(e).keyCode == 13 || j().mye(e).keyCode == 116) {
     T.searchmogo();
    }
    if (j().mye(e).keyCode == 116) {
     if (window.event) {
      try {
       j().mye(e).keyCode = 0;
      } catch (e) {}
      e.returnValue = false;
     } else {
      e.preventDefault();
     }
    }
   }
   if (j().mye(e).ctrlKey == true && j().mye(e).keyCode == 13) {
    if (document.getElementById('save' + t)) {
     navig == "fox" ? document.getElementById('save' + t).onclick() : document.getElementById('save' + t).click();
    }
    if (document.getElementById('duibisave_' + rid + '_0')) {
     document.getElementById('duibisave_' + rid + '_0').click();
    }
   }
   if (j().mye(e).keyCode == 13)
    j(obj).next().focus();
  }
 }
 ;
 this.addr = function(t, n) {
  var rid = 'nr' + (Math.random() + '').substring(0, 6);
  var ss = grid.gettr(t, rid, '', 1, 0, 3, 1, 0);
  j('[id="tabl_' + t + '"]').after(ss);
  j('[id="tab_' + t + '"]').after(grid.gettr(t, rid, '', 1, 3, 99, 0, 0));
 }
 ;
 this.cpn = {};
 this.psize = {};
 this.menu = function(t, wid, wy, editm, idmn) {
  var wy = Math.floor(sj[t].a.maxr / parseInt(j().getv('psize', 10)));
  if (wy > 0) {
   if (j('#tableb' + t).length == 0)
    j('#table' + t).after("<div class='clearfix' id=tableb" + t + "></div>");
   var curPageNo = parseInt(j().getv('curPageNo', 0));
   grid.cpn[t] = grid.cpn[t] || curPageNo;
   j('#tableb' + t + '').html(j().ui({
    cid: 'tableb' + t + '',
    w: 80,
    h: 26,
    ca: '首页|grid.nextp(this,0,' + idmn + ')`上页|grid.nextp(this,-1,' + idmn + ')`' + ((grid.cpn[t] + 1) || 1) + "`下页|grid.nextp(this,'+1'," + idmn + ")`" + (wy + 1) + '页|grid.nextp(this,' + wy + ',' + idmn + ')'
   }));
  }
  if (j('#tablet' + t).length == 0)
   j('#table' + t).before("<div class='clearfix' id=tablet" + t + "></div>");
  var ckey = '';
  if (idmn) {
   ckey = (db.sj.mn.all[idmn] && db.sj.mn.all[idmn].ckey || '');
   editm = (db.sj.mn.all[idmn] && db.sj.mn.all[idmn].editm || 1);
  }
  var stridmn = idmn || t;
  stablebg = j().ui({
   cid: 'btn' + t,
   w: 55,
   ca: "新增|grid.addr('" + t + "')`保存|grid.save(" + (idmn || ("'" + t + "'")) + ")`<input type=text id=ckey" + stridmn + " value='" + ckey + "' style='height:25px;border:0'>`搜索|grid.soso(" + (idmn || ("'" + t + "'")) + ")"
  });
  j('#tablet' + t).html(stablebg);
  j('#btn' + t + '_1').hide();
  j('#btn' + t + '_2').css({
   "width": "inherit"
  });
  if (editm != 1)
   j('#btn' + t + '_0').hide();
 }
 ;
 this.nextp = function(obj, fx, idmn) {
  var cp = fx;
  var t = j(obj).attr('id').split('_')[0].substring(6);
  if ((fx + "").substring(0, 1) == '-' || (fx + "").substring(0, 1) == '+')
   cp = Math.max(0, eval(grid.cpn[t] + (fx + "")));
  if (lurl.indexOf('grid') > -1) {
   window.location = j().getUrl('curPageNo', cp);
  } else {
   db.sj.mn.all[idmn].curPageNo = cp;
   grid.funmn(idmn)
  }
 }
 ;
 this.soso = function(idmn) {
  var aj = db.sj.mn.all[idmn];
  var t = aj.ct || 'cm';
  aj.curPageNo = 0;
  grid.cpn[t] = 0;
  grid.funmn(idmn);
 }
 ;
 this.funmn = function(idmn) {
  var aj = db.sj.mn.all[idmn];
  var t = aj.ct || 'cm';
  if (t.indexOf("(") > -1) {
   db.dofunc(t);
   return;
  }
  var qaa = (aj.cq || "all:id") + "|(ccl)all";
  var cgz = aj.cgz || "";
  aj.cw = (aj.cw || "1=1 ");
  var sscw = "";
  var ckey = j('#ckey' + idmn).vale();
  aj.ckey = ckey;
  if (ckey) {
   var fa = [];
   j.each(db.sj[aj.ct].all, function(i, n) {
    j.each(n, function(ii, nn) {
     fa.push(ii);
    });
    db.sj[aj.ct].f = fa.join();
    if (1 == 1)
     return false;
   });
   var nskey = 0;
   j.each(fa, function(i, n) {
    if (isNaN(ckey)) {
     if (n.indexOf("c") == 0)
      sscw += " or " + n + " like '{p}" + ckey + "{p}'";
    } else {
     if (n.indexOf("id") == 0)
      sscw += " or " + n + "=" + ckey + "";
    }
    nskey++;
    if (nskey > 5)
     return false;
   });
   if (sscw != '')
    sscw = " and (" + sscw.substring(3) + ")"
  }
  var cpn = aj.curPageNo || parseInt(j().getv('curPageNo', 0));
  grid.cpn[t] = cpn;
  var psize = (aj.psize || 10);
  var cww = aj.cw + sscw + " order by " + (aj.csx || " id desc ") + " limit " + (cpn * psize) + "," + (psize);
  var swvi = "|cta='" + t.split("_")[0] + "' and cgz='" + cgz + "'";
  if (cgz.length == 0)
   swvi = "|cta='" + t.split("_")[0] + "'";
  var opt = "021";
  if (t.indexOf("vs"))
   opt = "011";
  if (aj.csq) {
   j().getall(jg_aj.html[idmn].m, aj.div || 'divmain', 'table' + t, {
    sqajax: aj.csq,
    option: '&option=021',
    swhe: {
     whe: cww
    },
    func: function() {
     grid.menu(t, 0, 0, 1, idmn);
     if (jg_aj.html[idmn].t)
      j('#table' + t).before(jg_aj.html[idmn].t);
    }
   }, aj.ct, aj.cq, aj.csid, '', '', '', false);
   ;
  } else {
   db.sajax(t + "|vi", qaa, (cww) + swvi, '01', function(i, jsn) {
    sj[t] = db.sj[t];
    sj.vi = db.sj.vi;
    grid.build('table' + t, aj.div || 'divmain', t, aj.editm || 1, '', jsn[t]);
   }, '&option=' + opt + '&idpg=' + idpg + '&idcm=' + (jg_aj.idcm || idcm || '') + '&tidcm=' + (jg_aj.tidcm || ''));
  }
 }
 ;
 this.build = function(gridid, divid, t, editm, style, jsn) {
  var gdl = j().getv('gdl', 3);
  var json = jsn || sj[t];
  var dividw = j('#' + divid).width();
  var innera = new Array();
  var innera1 = new Array();
  innera[0] = '<div class=tdtop style="width:100%">&nbsp;信息</div>';
  innera[1] = '<div class=tdtop style="width:40px">&nbsp;</div>';
  innera1[0] = j().ui({
   cid: 'xh' + t,
   ca: "|grid.editallr(this)",
   w: 8,
   s: 0,
   h: 22,
   class1: 'x_check leftm',
   ncheck: 99
  });
  if (t == 'vi@2') {
   sj[t].f += (',id');
  }
  if (editm > 0) {
   j.each(json.f.split(','), function(ii, nn) {
    var wb = '100%';
    var snn = nn;
    if (sj.vi)
     if (sj.vi.all[nn]) {
      if (sj.vi.all[nn].cwi)
       wb = (sj.vi.all[nn].cwi) + 'px';
      if (nn != 'sx')
       snn = sj.vi.all[nn].ctn;
      if (lurl.indexOf("grid.jsp") > -1)
       snn = nn + snn;
     }
    if (wb != '-1px') {
     if (ii < gdl) {
      innera1[ii + 1] = '<div class=tdtop ccl=' + nn + ' title=' + snn + ' style="width:' + wb + ';text-align:center;overflow:hidden;height:26px">' + snn + '</div>';
     } else {
      innera[ii - gdl] = '<div class=tdtop ccl=' + nn + ' title=' + snn + ' style="width:' + wb + ';text-align:center;overflow:hidden;height:26px">' + snn + '</div>';
     }
    }
   });
  }
  var strtr = '';
  strtrl = '';
  strxh = '';
  if (json) {
   j.each(json.all, function(i, n) {
    strtrl += grid.gettr(t, i, n, editm, 0, gdl, 1, style);
    strtr += grid.gettr(t, i, n, editm, gdl, 99, 0, style);
   });
  }
  var inners = grid.newhtb('tab_' + t, '', innera, strtr, '100%');
  var innersl = grid.newhtb('tabl_' + t, '', innera1, strtrl, '360');
  var strgrid = grid.newtb('table' + t, 'ccc', '<div id=tdou_' + t + ' style="' + (style > 10 ? '' : 'overflow-x:auto;') + '">' + inners + '</div>', '', innersl);
  document.getElementById(divid).innerHTML = strgrid;
  if (style > 10)
   j('#tdleft_table' + t).hide();
  var realw = dividw - j('#tdleft_table' + t).width() - 8;
  document.getElementById('tdou_' + t).style.width = (realw + 'px');
  grid.menu(t, 'divmain', '', editm);
  if (sj[t].a.maxr == 0) {
   j('.gridtd').css('border-bottom', '#333 1px solid');
   if (j('#datatishi_' + t).length == 0)
    j('#table' + t).after("<div id=datatishi_" + t + " class='cent div1'>无数据</div>");
  }
  if (j('.tdtop').resizable) {
   j('.tdtop').resizable({
    handles: 'e',
    stop: function(event, ui) {
     db.sajax('vi', "cwi='" + j(ui.element[0]).width() + "'", "cta='" + t.split('@')[0] + "' and ccl='" + j(ui.element[0]).attr('ccl') + "'", "", function() {});
    },
    resize: function(e, ui) {
     j(ui.element[0]).parent().width(j(ui.element[0]).width())
    }
   });
  }
 }
 ;
 this.pastexls = function(obj) {
  var en = j(obj).attr('en');
  var t = j(obj).attr('t');
  var rid = j(obj).attr('rid');
  var rv = obj.value.replace('##', '');
  var ra = rv.split('\n');
  var ca = ra[0].split(' ');
  if (ra.length + ca.length > 4)
   if (j('input[t="' + t + '"][en="' + en + '"]').length < ra.length - 1) {
    alert('请先新增足够的行。');
    return;
   }
  var n = 0;
  var begf = 0;
  j.each(j('input[t="' + t + '"][en="' + en + '"]'), function() {
   if (j(this).attr('rid') == rid) {
    begf = 1
   }
   if (n < ca.length && begf == 1) {
    if (grid.beginedit(this) == false)
     return false;
    j(this).val(ca[n]);
    n++;
   }
  });
 }
 ;
}
;var grid = new grid();
var db = new db();
var sj = sj || db.sj;
