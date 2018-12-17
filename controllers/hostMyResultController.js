import React from 'react';
import {renderToString} from 'react-dom/server';
import MyResultComponent from '../src/components/stats/myResultComponent';

export const hostMyResultController = (req, res) => {
	res.render('common', {
		pageTitle: 'My Results',
		jsPath: '/build/js/myResult.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<MyResultComponent />)
	});
}