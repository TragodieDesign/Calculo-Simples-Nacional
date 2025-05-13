import React, { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { Label } from './ui/Label'
import { ShoppingCart, Factory, Wrench, Hammer, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

const anexos = {
  'Comércio': 'I',
  'Indústria': 'II',
  'Serviços Gerais': 'III',
  'Serviços com encargos trabalhistas': 'IV',
  'Serviços intelectuais': 'V',
};

const tabelas = {
  I: [
    { limite: 180000, aliquota: 0.04, deducao: 0 },
    { limite: 360000, aliquota: 0.073, deducao: 5940 },
    { limite: 720000, aliquota: 0.095, deducao: 13860 },
    { limite: 1800000, aliquota: 0.107, deducao: 22500 },
    { limite: 3600000, aliquota: 0.143, deducao: 87300 },
    { limite: 4800000, aliquota: 0.19, deducao: 378000 },
  ],
  II: [
    { limite: 180000, aliquota: 0.045, deducao: 0 },
    { limite: 360000, aliquota: 0.078, deducao: 5940 },
    { limite: 720000, aliquota: 0.1, deducao: 13860 },
    { limite: 1800000, aliquota: 0.112, deducao: 22500 },
    { limite: 3600000, aliquota: 0.147, deducao: 85500 },
    { limite: 4800000, aliquota: 0.3, deducao: 720000 },
  ],
  III: [
    { limite: 180000, aliquota: 0.06, deducao: 0 },
    { limite: 360000, aliquota: 0.112, deducao: 9360 },
    { limite: 720000, aliquota: 0.135, deducao: 17640 },
    { limite: 1800000, aliquota: 0.16, deducao: 35640 },
    { limite: 3600000, aliquota: 0.21, deducao: 125640 },
    { limite: 4800000, aliquota: 0.33, deducao: 648000 },
  ],
  IV: [
    { limite: 180000, aliquota: 0.045, deducao: 0 },
    { limite: 360000, aliquota: 0.09, deducao: 8100 },
    { limite: 720000, aliquota: 0.12, deducao: 15300 },
    { limite: 1800000, aliquota: 0.14, deducao: 27900 },
    { limite: 3600000, aliquota: 0.22, deducao: 153000 },
    { limite: 4800000, aliquota: 0.33, deducao: 648000 },
  ],
  V: [
    { limite: 180000, aliquota: 0.15, deducao: 0 },
    { limite: 360000, aliquota: 0.18, deducao: 4500 },
    { limite: 720000, aliquota: 0.195, deducao: 9900 },
    { limite: 1800000, aliquota: 0.205, deducao: 17100 },
    { limite: 3600000, aliquota: 0.23, deducao: 62100 },
    { limite: 4800000, aliquota: 0.305, deducao: 540000 },
  ],
};

const icones = {
  'Comércio': <ShoppingCart size={20} />,
  'Indústria': <Factory size={20} />,
  'Serviços Gerais': <Wrench size={20} />,
  'Serviços com encargos trabalhistas': <Hammer size={20} />,
  'Serviços intelectuais': <Brain size={20} />,
};

export default function AdvancedCalculator() {
  const [atividade, setAtividade] = useState('')
  const [rbt12, setRbt12] = useState('')
  const [faturamento, setFaturamento] = useState('')
  const [resultado, setResultado] = useState(null)
  const [mostrarTabela, setMostrarTabela] = useState(false)
  const [faixaSelecionada, setFaixaSelecionada] = useState(null);
  const [aliquotaEfetiva, setAliquotaEfetiva] = useState(null);


  const calcular = () => {
    const anexo = anexos[atividade]
    const tabela = tabelas[anexo]
    const rbt = extrairNumero(rbt12)
    const faturamentoMes = extrairNumero(faturamento)
    

    if (!tabela || isNaN(rbt) || isNaN(faturamentoMes)) {
      alert('Preencha todos os campos corretamente.')
      setResultado(null)
      return
    }

    const faixa = tabela.find(t => rbt <= t.limite) || tabela[tabela.length - 1]
    const aliquotaEfetiva = ((rbt * faixa.aliquota) - faixa.deducao) / rbt
    const imposto = (faturamentoMes * aliquotaEfetiva).toFixed(2)

    setResultado(imposto >= 0 ? imposto : 0);
    setFaixaSelecionada(faixa);
    setAliquotaEfetiva(aliquotaEfetiva);
  }


  const formatarParaReal = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, '');
    const numero = parseFloat(somenteNumeros) / 100;
  
    if (isNaN(numero)) return '';
  
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const extrairNumero = (valorFormatado) => {
    const limpo = valorFormatado.replace(/\D/g, '');
    return parseFloat(limpo) / 100;
  };
  




  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <Label>Qual é a atividade da sua empresa? (com respectivo anexo)</Label>
          <select value={atividade} onChange={(e) => setAtividade(e.target.value)} className="w-full border rounded p-2">
            <option value="">Selecione...</option>
            {Object.keys(anexos).map(key => (
                <option key={key} value={key}>
                {key} - Anexo {anexos[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Faturamento dos últimos 12 meses (R$)</Label>
          <Input   value={rbt12} onChange={(e) => setRbt12(formatarParaReal(e.target.value))} />
          


        </div>
        <div>
          <Label>Faturamento do mês (R$)</Label>
          <Input value={faturamento} onChange={(e) => setFaturamento(formatarParaReal(e.target.value))}/>
        </div>
        <Button onClick={calcular}>Calcular</Button>
        {resultado !== null && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-green-700 font-bold space-y-2"
          >
            <p>💰 Valor estimado do imposto: R$ {resultado}</p>
            <p>📊 Faixa enquadrada: até R$ {faixaSelecionada.limite.toLocaleString()}</p>
            <p>📈 Alíquota efetiva: {(aliquotaEfetiva * 100).toFixed(2)}%</p>
          </motion.div>


          
        )}
        {atividade && (
          <Button onClick={() => setMostrarTabela(!mostrarTabela)}>
            {mostrarTabela ? 'Ocultar Tabela' : 'Ver Tabela do Anexo'}
          </Button>
        )}
        {mostrarTabela && anexos[atividade] && tabelas[anexos[atividade]] && (
          <div>
            <h3 className="font-bold mt-4 mb-2">Tabela do Anexo {anexos[atividade]}</h3>
            <table className="w-full text-left border">
              <thead>
                <tr><th>Limite</th><th>Alíquota</th><th>Dedução</th></tr>
              </thead>
              <tbody>
                {tabelas[anexos[atividade]].map((faixa, index) => (
                  <tr key={index}>
                    <td>Até R$ {faixa.limite.toLocaleString()}</td>
                    <td>{(faixa.aliquota * 100).toFixed(2)}%</td>
                    <td>R$ {faixa.deducao.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
