var gBandFreq  = new Array();
var gBandArfcn = new Array();

function getRadioName(id)
{
    var radioName;
    
    if(id == "TR_1")
        radioName = "carrierTypeA1";
    else if(id == "TR_2")
        radioName = "carrierTypeB2";
    else if(id == "TR_3")
        radioName = "carrierTypeA3";
    else if(id == "TR_4")
        radioName = "carrierTypeB4";
    else if(id == "TR_5")
        radioName = "carrierTypeA5";
    else if(id == "TR_6")
        radioName = "carrierTypeB6";
    else if(id == "TR_7")
        radioName = "carrierTypeA7";
    else if(id == "TR_8")
        radioName = "carrierTypeB8";

    return radioName;
}

function getRadioValue(RadioName)
{
    var obj;    
    obj=document.getElementsByName(RadioName);
    if(obj!=null)
    {
        var i;
        for(i=0;i<obj.length;i++)
        {
            if(obj[i].checked)
            {
                return obj[i].value;            
            }
        }
    }
    return null;
}

function setRadio(id, checked)
{
	var radioName = getRadioName(id);
  var obj = document.getElementsByName(radioName);
  //alert(radioName);
  if(obj!=null)
  {
    var i;
    for(i=0;i<obj.length;i++)
    {
      if(checked == true)
        obj[i].disabled = false;
      else
        obj[i].disabled = true;
    }
    return true;
  }
    return false;
}

function updateArea(val)//public
{
	if(val == "3")//WCDMA
	{
	  document.getElementById("LTEGSM").style.display   = "none";
	  document.getElementById("WCDMA").style.display    = "block";
	  document.getElementById("bandArea").style.display = "block";
	  document.getElementById("bandArfcnArea").style.display = "none";
	}
	else
	{
		document.getElementById("LTEGSM").style.display = "block";
		document.getElementById("WCDMA").style.display = "none";
		if(val == "2")//GSM
	  {
	  	document.getElementById("bandArea").style.display = "none";
	  	document.getElementById("bandArfcnArea").style.display = "block";
		  document.getElementById("carrierFreqArea").style.display = "none";
		  document.getElementById("arfcnArea").style.display = "block";
		  document.getElementById("subBandFunctionOnArea").style.display = "none";
		  document.getElementById("subBandFunctionOn").checked = false;
		  document.getElementById("carrierBandwidthArea").style.display = "none";
		  document.getElementById("carrierBandwidth").value = "0";
		  document.getElementById("bbSampleRate").value = "960";
		  document.getElementById("carrierBandwidth").value = "200";
		  document.getElementById("txCarrGainSettingArea").style.display = "block";
		  updateArfcnArea();
	  }
	  else //LTE
	  {
	  	document.getElementById("bandArea").style.display = "block";
	  	document.getElementById("bandArfcnArea").style.display = "none";
	    document.getElementById("carrierFreqArea").style.display = "block";
		  document.getElementById("arfcnArea").style.display = "none";
		  document.getElementById("subBandFunctionOnArea").style.display = "block";
		  document.getElementById("carrierBandwidthArea").style.display = "block";
		  document.getElementById("carrierBandwidth").value = "5000";
		  document.getElementById("bbSampleRate").value = "7680";
		  document.getElementById("txCarrGainSettingArea").style.display = "none";
	  }
	  updateSubBandFuncOn();
	}
}

function updateUI()//public
{
  updateBandFromXML();//public
	updateArea(document.getElementById("ratType").value);

	updateLteCarrFreqRange();//LTE
	updateFreqValue();//WCDMA
  updateTrDevInfo(0);//WCDMA
}

function updateBandFromXML()
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp.open("GET","band.xml",false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  
  var bandItems = document.getElementById("band");
  if(bandItems != null)
  {
  	var item = xmlDoc.getElementsByTagName("banditem");
  	
  	for(var i=0,len=item.length; i<len; i++)
  	{
  		var op = document.createElement("option");
  		op.text = item[i].getElementsByTagName("bandid")[0].childNodes[0].nodeValue;
  		op.value = i;
  		bandItems.add(op);
  		
  		gBandFreq[i] = new Array();
  		gBandFreq[i][0] = item[i].getElementsByTagName("ulfmin")[0].childNodes[0].nodeValue;
  		gBandFreq[i][1] = item[i].getElementsByTagName("ulfmax")[0].childNodes[0].nodeValue;
  		gBandFreq[i][2] = item[i].getElementsByTagName("dlfmin")[0].childNodes[0].nodeValue;
  		gBandFreq[i][3] = item[i].getElementsByTagName("dlfmax")[0].childNodes[0].nodeValue;
  	}
  }
  
  xmlhttp.open("GET","gsmArfcn.xml",false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  var arfcnItems = document.getElementById("bandArfcn");
  if(arfcnItems != null)
  {
  	item = xmlDoc.getElementsByTagName("banditem");
  	
  	for(var i=0,len=item.length; i<len; i++)
  	{
  		var op = document.createElement("option");
  		op.text = item[i].getElementsByTagName("bandid")[0].childNodes[0].nodeValue;
  		op.value = i;
  		arfcnItems.add(op);
  		
  		gBandArfcn[i] = new Array();
  		gBandArfcn[i][0] = item[i].getElementsByTagName("arfcn_min")[0].childNodes[0].nodeValue;
  		gBandArfcn[i][1] = item[i].getElementsByTagName("arfcn_max")[0].childNodes[0].nodeValue;
  		if(op.text == "bandVIII")
  		{
  		  gBandArfcn[i][2] = item[i].getElementsByTagName("arfcn_min")[1].childNodes[0].nodeValue;
  	    gBandArfcn[i][3] = item[i].getElementsByTagName("arfcn_max")[1].childNodes[0].nodeValue;
  	  }
  	}
  }
}

function updateInfoDueToBand()
{
	var rat = document.getElementById("ratType").value;
	
	if(rat == "3") //WCDMA
	{
	  updateFreqValue();
	  updateTrDevInfo(0);
	}
	else if(rat == "0" || rat == "1")//LTE
	{
		updateLteCarrFreqRange();
	}
}