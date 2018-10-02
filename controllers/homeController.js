import React from 'react';
import {renderToString} from 'react-dom/server';
import HomeComponent from '../src/components/home/homeComponent';


export const homeController = (req, res) => {
	res.render('common', {
		pageTitle: 'Home',
		jsPath: '/build/js/home.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<HomeComponent />)
	});
}