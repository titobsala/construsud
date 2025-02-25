import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';

const NewChapterModal = () => {
  const { setShowNewChapterModal, addChapter } = useBudget();
  
  const [formData, setFormData] = useState({
    chapterNumber: '',
    header: '',
    template: ''
  });
  
  const [chapterTemplates, setChapterTemplates] = useState([
    { id: 'FUNDACAO', name: 'FUNDAÇÃO SUPERFICIAL - B. S.C/VIGA' },
    { id: 'MOVIMENTO', name: 'MOVIMENTO DE TERRA, REATERRO, COMPACTACAO E NIVELAMENTO' },
    { id: 'PAREDES', name: 'PAREDES' },
    { id: 'ESTRUTURA', name: 'ESTRUTURA METÁLICA' },
    { id: 'COBERTURA', name: 'COBERTURA E RUFOS' },
    { id: 'PISOS', name: 'PISOS E REVESTIMENTOS' },
    { id: 'INSTALACOES', name: 'INSTALAÇÕES ELÉTRICAS E HIDRÁULICAS' },
    { id: 'FORRO', name: 'FORRO' },
    { id: 'PINTURAS', name: 'PINTURAS' },
    { id: 'VIDROS', name: 'VIDROS E ESQUADRIAS' }
  ]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState(chapterTemplates);
  
  useEffect(() => {
    const filtered = chapterTemplates.filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTemplates(filtered);
  }, [searchQuery, chapterTemplates]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      header: template.name
    }));
    setIsDropdownOpen(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.chapterNumber || !formData.header) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    const chapterKey = `CAR ${formData.chapterNumber}`;
    const success = addChapter(chapterKey, formData.header);
    
    if (!success) {
      alert(`Capítulo ${chapterKey} já existe`);
      return;
    }
    
    setShowNewChapterModal(false);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Adicionar Novo Capítulo
            </h2>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => setShowNewChapterModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número do Capítulo
            </label>
            <input
              type="text"
              name="chapterNumber"
              value={formData.chapterNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Ex: 10"
              required
            />
          </div>
          
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Capítulo
            </label>
            <div className="relative">
              <input
                type="text"
                name="header"
                value={formData.header}
                onChange={handleChange}
                onClick={() => setIsDropdownOpen(true)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Selecione ou digite o título"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ul>
                  {filteredTemplates.map(template => (
                    <li 
                      key={template.id}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300 text-sm"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.name}
                    </li>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                      Nenhum resultado encontrado
                    </li>
                  )}
                </ul>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Selecione um dos títulos predefinidos ou insira um personalizado
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 dark:text-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-indigo-500 transition-colors"
              onClick={() => setShowNewChapterModal(false)}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-indigo-500 transition-colors"
            >
              Criar Capítulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChapterModal;