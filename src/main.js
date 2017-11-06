const OPEN_WEATHER_APP_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=c8f1cd3f0bcb5537c9394a7706a9d778';

var getTemp= (location)=>{

	return axios.get(OPEN_WEATHER_APP_URL,{
		params:
			(typeof location==="string"? 
				{q:location} : 
				{lat:location.lat,lon:location.lng})
	}).then(
		(resp)=>{
			if(resp.data.cod && resp.data.message){
				throw new Error(resp.data.message);
			}
			else{
				console.log(resp.data);
				let time = resp.data.weather[0].icon;
				time = time[time.length-1];
				time = time=='n'?'night':'day';
				return {temp:resp.data.main.temp,city:resp.data.name,icon:resp.data.weather[0].id,time:time};
			}
		},
		function(err){
			throw new Error(err.response.data.message);
		}
	);
}


var getLocation = ()=>{
	return new Promise((resolve,reject)=>{
		try{
			navigator.geolocation.getCurrentPosition(p=>resolve(p),err=>reject(err))
		}
		catch(err){
			reject(err);
		}
	});
}

var celunit = true;
var temp;
var updateTemp = (_temp,unit)=>{
	_temp = Math.round(_temp);
	if(_temp.length>2) document.getElementById('temp-h').classList.add('smaller');
	else document.getElementById('temp-h').classList.remove('smaller');
	document.getElementById('temp').innerHTML= _temp +'°'+unit;
};

var update = weather=>{
	temp = weather.temp;
	updateTemp(temp,'C');

	if(weather.city){
		document.getElementById('city-h').classList.remove('smaller');
		document.getElementById('city').innerHTML= weather.city;
	}
	else{
		document.getElementById('city-h').classList.add('smaller');
		document.getElementById('city').innerHTML= 'Somewhere in the earth';
	}
	
	document.getElementById('icon').setAttribute('class','wi wi-owm-'+weather.time+'-'+weather.icon);
}

var switchUnit = ()=>{
	if(!temp) return;
	if(celunit){
		// document.getElementById('switch-unit').innerHTML = '°C';
		updateTemp(temp=temp*9/5+32,'F');
	}
	else{
		// document.getElementById('switch-unit').innerHTML = '°F';
		updateTemp(temp=(temp-32)*5/9,'C');
	}
	celunit=!celunit;
}


var run = position=>{
	(position? 
		Promise.resolve(position) : 
		getLocation().then(p=>({lat:p.coords.latitude,lng:p.coords.longitude})).catch(err=>'Santiago')
	)
		.then(p=>getTemp(p))
		.then(r=>update(r));
}

var parsePosition = (lat,lng)=>({lat:lat,lng:lng})

run();
// run(parsePosition(76.438545, 104.304871));
// run(parsePosition(51.083564, 73.786229));
// run('santiago')
// run('wellington')