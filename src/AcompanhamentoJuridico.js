import $ from "jquery";
import InputCustomizado from "./componentes/InputCustomizado"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros'

class FormularioAcompanhamentoJuridico extends Component {
  constructor(props) {
    super(props);
    this.state = {titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''};
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);   
    this.handlAcompanhamentoJuridicoSubmit = this.handleAcompanhamentoJuridicoSubmit.bind(this);
  }
  
  setTitulo(e) {
    this.setState({titulo: e.target.value});
  }

  setPreco(e) {
    this.setState({preco: e.target.value});
  }

  setAutorId(e) {
    this.setState({autorId: e.target.value});
  }
  
  
  handleAcompanhamentoJuridicoSubmit(e) {
    e.preventDefault();
    var titulo = this.state.titulo.trim();
    var preco = this.state.preco.trim();
    var autorId = this.state.autorId;

    $.ajax({
      url: 'http://assofce.kinghost.net:21314/acompanhamentoJuridico/cadastrar',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''}),
      success: function(novaListagem) {
          PubSub.publish( 'atualiza-lista-acompanhamentos',novaListagem);            
          this.setState({titulo:'',preco:'',autorId:''});
      },
      error: function(resposta){
        if(resposta.status === 400){
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }            
    });  
    
    this.setState({titulo: '', preco: '', autorId: ''});
  }
  
  render() {
    var usuarios = this.props.usuarios.map(function(usuario){
      return <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nome}</option>;
    });
    return (
      <div className="autorForm">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}>
          <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo" onChange={this.setTitulo} />
          <InputCustomizado id="detalhes" name="detalhes" label="Detalhes: " type="text" value={this.state.detalhes} placeholder="Detalhes" onChange={this.setPreco} />
          <InputCustomizado id="numeroProcesso" name="numeroProcesso" label="Número do Processo: " type="text" value={this.state.numeroProcesso} placeholder="Número do Processo" onChange={this.setPreco} />

          <div className="pure-controls">
            <select value={this.state.id_usuario} name="id_usuario" onChange={this.id_usuario}>
              <option value="">Selecione</option>
              {usuarios}
            </select>
          </div>
          <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
          </div>          
        </form>             
      </div>
    );
  }
} 

class TabelaAcompanhamentoJuridico extends Component {
  
  render() {
    var livros = this.props.lista.map(function(livro){
      return(
          <tr key={livro.titulo}>
            <td>{livro.titulo}</td>
            <td>{livro.autor.nome}</td>
            <td>{livro.preco}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Preco</th>
          </tr>
        </thead>
        <tbody>
          {livros}
        </tbody>
      </table>
    );
  }
}

export default class AcompanhamentoJuridicoAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {lista : [],autores:[]};
  }

  componentDidMount() {
    $.ajax({
      url: "http://localhost:8080/api/livros",
      dataType: 'json',
      success: function(data) {
        this.setState({lista: data});
      }.bind(this)
    });
    
    $.ajax({
      url: "http://localhost:8080/api/autores",
      dataType: 'json',
      success: function(data) {
        this.setState({autores: data});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-acompanhamentos', function(topicName,lista){
      this.setState({lista:lista});
    }.bind(this));    
  }


  render() {
    return(
      <div>
        <div className="header">
          <h1>Cadastro de Acompanhamento Juridico</h1>
        </div>
        <div className="content" id="content">
          <FormularioAcompanhamentoJuridico usuarios={this.state.usuarios}/>
          <TabelaAcompanhamentoJuridico lista={this.state.lista}/>
        </div>
      </div>
    );
  }
} 