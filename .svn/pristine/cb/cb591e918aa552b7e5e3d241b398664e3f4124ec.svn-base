class SetApiEndPoint {
	getApiEndPoint(){
		if(window.location.hostname==="www.testwave.in"){
			return	window.location.origin+':3210/api/';
		}else{
			return	'http://192.168.88.2:3210/api/';
		}
	}
}
const setApiEndPoint=new SetApiEndPoint;


export const environment = {
  production: true,
  API_ENDPOINT: setApiEndPoint.getApiEndPoint()
};