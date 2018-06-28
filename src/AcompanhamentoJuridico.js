import $ from "jquery";
import InputCustomizado from "./componentes/InputCustomizado"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros'

class FormularioAcompanhamentoJuridico extends Component {
  constructor(props) {
    super(props);
    this.setIdUsuario = this.setIdUsuario.bind(this);   

    this.state = {titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''};
    this.handleAcompanhamentoJuridicoSubmit = this.handleAcompanhamentoJuridicoSubmit.bind(this);

  }
  
  setIdUsuario(e) {
    this.setState({id_usuario: e.target.value});
  }
  
  salvaAlteracao(nomeInput,evento){
    var campoSendoAlterado = {};
    campoSendoAlterado[nomeInput] = evento.target.value;    
    this.setState(campoSendoAlterado);   
  }
  
  handleAcompanhamentoJuridicoSubmit(e) {
    e.preventDefault();    

    console.log(this.state.titulo);

    let acompanhamentoJuridico ={titulo: this.state.titulo, data: new Date(),
      detalhes:this.state.detalhes,numeroProcesso:this.state.numeroProcesso, 
      id_usuario: this.state.id_usuario};
    $.ajax({
      url: 'http://localhost:1234/acompanhamentoJuridico/cadastrar',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(acompanhamentoJuridico),
      success: function(resposta) {
          $.ajax({
            url: "http://assofce.kinghost.net:21314/acompanhamentoJuridico",
            dataType: 'json',
            success: function(data) {
              PubSub.publish('atualiza-lista-acompanhamentos',data);        
            }.bind(this)
          });
          this.state  ={titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''};

      }.bind(this),
      error: function(resposta){
        if(resposta.status === 400){
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }            
    });  
    
  }
  
  render() {
    var usuarios = this.props.usuarios.map(function(usuario){
      return <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nome}</option>;
    });
    return (
      <div className="autorForm">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleAcompanhamentoJuridicoSubmit} method="post">
          <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo" onChange={this.salvaAlteracao.bind(this,'titulo')} />
          <InputCustomizado id="detalhes" name="detalhes" label="Detalhes: " type="text" value={this.state.detalhes} placeholder="Detalhes" onChange={this.salvaAlteracao.bind(this,'detalhes')}  />
          <InputCustomizado id="numeroProcesso" name="numeroProcesso" label="Número do Processo: " type="text" value={this.state.numeroProcesso} placeholder="Número do Processo" onChange={this.salvaAlteracao.bind(this,'numeroProcesso')}  />

          <div className="pure-controls">
            <select value={this.state.id_usuario} name="id_usuario" onChange={this.setIdUsuario}>
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
    var acompanhamentos = this.props.lista.map(function(acompanhamento){
      return(
          <tr key={acompanhamento.id_acompanhamento_juridico}>
            <td>{acompanhamento.titulo}</td>
            <td>{acompanhamento.detalhes}</td>
            <td>{acompanhamento.numeroProcesso}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Detalhe</th>
            <th>Numero do processo</th>
          </tr>
        </thead>
        <tbody>
          {acompanhamentos}
        </tbody>
      </table>
    );
  }
}

export default class AcompanhamentoJuridicoAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {lista : [],usuarios:[]};
  }

  componentDidMount() {
    $.ajax({
      url: "http://assofce.kinghost.net:21314/acompanhamentoJuridico",
      dataType: 'json',
      success: function(data) {
        this.setState({lista: data});
      }.bind(this)
    });
    
    $.ajax({
      url: "http://assofce.kinghost.net:21314/usuarios",
      dataType: 'json',
      success: function(data) {
        this.setState({usuarios: data});
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