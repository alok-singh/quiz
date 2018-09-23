import React from 'react';
import {renderToString} from 'react-dom/server';
import PlayerHomeComponent from '../src/components/home/playerHomeComponent';


export const playerHomeController = (req, res) => {
	res.render('common', {
		pageTitle: 'Player Home',
		jsPath: './build/js/playerHome.bundle.js',
		cssPath: './build/css/index.css',
		innerHTML: renderToString(<PlayerHomeComponent />)
	});
}