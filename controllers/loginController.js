import React from 'react';
import {renderToString} from 'react-dom/server';
import LoginComponent from '../src/components/login/loginComponent';


export const loginController = (req, res) => {
	res.render('common', {
		pageTitle: 'Login',
		jsPath: './build/js/login.bundle.js',
		cssPath: './build/css/signin.css',
		innerHTML: renderToString(<LoginComponent />)
	});
}