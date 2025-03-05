import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';

const EditChapterModal = () => {
  const { 
    setShowEditChapterModal, 
    currentChapter,
    updateChapter,
    deleteChapter
  } = useBudget();
  
  const [formData, setFormData] = useState({
    chapterNumber: '',
    header: ''
  });
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [chapterTemplates] = useState([
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
    if (currentChapter) {
      const chapterNumber = currentChapter.chapterKey.split(' ')[1];
      setFormData({
        chapterNumber: chapterNumber,
        header: currentChapter.chapter.header
      });
    }
  }, [currentChapter]);
  
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
    
    const newChapterKey = `CAR ${formData.chapterNumber}`;
    
    // Only allow editing the header, not the chapter number/key
    // if the chapter key changed, show an error
    if (newChapterKey !== currentChapter.chapterKey) {
      alert('Não é possível alterar o número do capítulo. Se necessário, exclua e crie um novo capítulo.');
      return;
    }
    
    updateChapter(currentChapter.chapterKey, formData.header);
    setShowEditChapterModal(false);
  };
  
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    deleteChapter(currentChapter.chapterKey)
      .then(() => {
        setShowEditChapterModal(false);
      })
      .catch(error => {
        console.error('Error deleting chapter:', error);
        alert('Erro ao excluir capítulo. Tente novamente.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };
  
  if (!currentChapter) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Editar Capítulo
            </h2>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => setShowEditChapterModal(false)}
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
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 cursor-not-allowed dark:text-gray-200"
              disabled
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              O número do capítulo não pode ser alterado
            </p>
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
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
                    className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
          </div>
          
          <div className="flex justify-between">
            <div>
              {!confirmDelete ? (
                <button
                  type="button"
                  className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-500 transition-colors"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 text-white dark:bg-red-600 border border-red-600 dark:border-red-700 hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 dark:text-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-red-500 transition-colors"
                onClick={() => setShowEditChapterModal(false)}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChapterModal;