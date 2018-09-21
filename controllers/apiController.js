import api from '../service/api';

export const gatewayPostController = (req, res) => {
	api.post(req.url, req.body, req.headers).then((response) => {
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}

export const gatewayGetController = (req, res) => {
	api.get(req.url, req.headers).then((response) => {
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}