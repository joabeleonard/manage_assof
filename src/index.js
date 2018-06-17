import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AutorBox from './Autor';
import NoticiaBox from './Noticia';
import Home from './Home';
import Livro from './Livro';
import AcompanhamentoJuridicoAdmin from './AcompanhamentoJuridico';

import './index.css';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';

ReactDOM.render(
  (<Router history={browserHistory}>
  	<Route path="/" component={App}>
  		<IndexRoute component={Home}/>
	  	<Route path="/autor" component={AutorBox}/>
	  	<Route path="/livro" component={Livro}/>
		<Route path="/noticias" component={NoticiaBox}/>
		<Route path="/acompanhamentoJuridico" component={AcompanhamentoJuridicoAdmin}/>

  	</Route>
  </Router>),
  document.getElementById('root')
);
