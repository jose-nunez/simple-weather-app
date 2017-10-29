const OPEN_WEATHER_APP_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=c8f1cd3f0bcb5537c9394a7706a9d778';


var getTemp= (location)=>{

	return axios.get(OPEN_WEATHER_APP_URL,{params:{
		lat:location.lat,
		lon:location.lng,
	}}).then(
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
			navigator.geolocation.getCurrentPosition(p=>resolve(p))
		}
		catch(err){
			reject(err);
		}
	});
}


var run = ()=>{
	getLocation()
		.then(p=>({lat:p.coords.latitude,lng:p.coords.longitude}))
		// .then(p=>{console.log(p);return p;})
		.then(p=>getTemp(p))
		// .then(r=>console.log(r));
		.then(r=>{


			document.getElementById('temp').innerHTML=r.temp+'&#176;';
			document.getElementById('city').innerHTML=r.city;
			document.getElementById('icon').setAttribute('class','wi wi-owm-'+r.time+'-'+r.icon);
			document.getElementById('icon').innerHTML=' | ';

		});
}

run();