import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';
import axios from 'axios';

class FormularioNoticia extends Component {

  constructor() {
    super();    
    this.state = {titulo:'',noticia:'', data:'', image:'', file:null};
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();    
    $.ajax({
      url:'http://assofce.kinghost.net:21314/noticias/cadastar',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({titulo:this.state.titulo,noticia:this.state.noticia,
            data:new Date(),image:this.state.image2}),
      success: function(novaListagem){

          const fd = new FormData();
          fd.append('image', this.state.file, this.state.file.name);
          axios.post('http://assofce.kinghost.net:21314/usuarios/uploadImage', fd).
              then(res => {
                $.ajax({
                  url:"http://assofce.kinghost.net:21314/noticias",
                  dataType: 'json',
                  success:function(resposta){ 
                    PubSub.publish('atualiza-lista-noticias',resposta);      
                    this.setState({id_noticia:'',titulo:'',noticia:'', data:'', image:''});   
                  }.bind(this)
                }); 
              });
        }.bind(this),
      error: function(resposta){
        if(resposta.status === 400) {
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }      
    });
  }
  
  salvaAlteracao(nomeInput,evento){
    var campoSendoAlterado = {};
    campoSendoAlterado[nomeInput] = evento.target.value;    
    this.setState(campoSendoAlterado);   
  }

  fileSelectedHandler = event =>{
    this.setState({file:event.target.files[0],image:event.target.value, image2:event.target.files[0].name}); 
    console.log(event.target.files[0])
  }

	render() {
		return (
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this,'titulo')} label="Titulo"/>                                              
                <InputCustomizado id="noticia" type="text" name="noticia" value={this.state.noticia} onChange={this.salvaAlteracao.bind(this,'noticia')} label="Noticia"/>                                              
                <InputCustomizado id="file" type="file" name="file" value={this.state.image} onChange={this.fileSelectedHandler} label="Imagem"/>                                                                      
                <div className="pure-control-group">                                  
                  <label></label> 
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                </div>
              </form>             

            </div>  

		);
	}
}

class TabelaNoticias extends Component {

	render() {
		return(
                    <div>            
                      <table className="pure-table">
                        <thead>
                          <tr>
                            <th>Titulo</th>
                            <th>Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.lista.map(function(noticia){
                              return (
                                <tr key={noticia.id_noticia}>
                                  <td>{noticia.titulo}</td>
                                  <td>{noticia.data}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table> 
                    </div>             		
		);
	}
}


export default class NoticiaBox extends Component {

  constructor() {
    super();    
    this.state = {lista : []};    
  }

  componentDidMount(){  
    $.ajax({
        url:"http://assofce.kinghost.net:21314/noticias",
        dataType: 'json',
        success:function(resposta){    
          this.setState({lista:resposta});
        }.bind(this)
      } 
    );          

    PubSub.subscribe('atualiza-lista-noticias',function(topico,novaLista){
      this.setState({lista:novaLista});
    }.bind(this));
  }   


  render(){
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Noticias</h1>
        </div>
        <div className="content" id="content">                            
          <FormularioNoticia/>
          <TabelaNoticias lista={this.state.lista}/>        
        </div>      

      </div>
    );
  }
}