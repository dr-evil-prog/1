import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Course, Module, Material, Exam, Question, QuestionType } from '../types';


// Helper component for editing/adding a question
const QuestionForm: React.FC<{
    question?: Question;
    onSave: (data: Omit<Question, 'id'>) => void;
    onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
    const { t } = useAppContext();
    const [text, setText] = useState(question?.text || '');
    const [type, setType] = useState<QuestionType>(question?.type || QuestionType.MULTIPLE_CHOICE);
    const [options, setOptions] = useState(question?.options?.join('\n') || '');
    const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const questionData = {
            text,
            type,
            options: type === QuestionType.MULTIPLE_CHOICE ? options.split('\n').filter(o => o.trim() !== '') : undefined,
            correctAnswer: type === QuestionType.TRUE_FALSE ? correctAnswer === 'true' : correctAnswer,
        };
        onSave(questionData);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="p-4 my-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
            <h4 className="text-lg font-semibold">{question ? t('courseMgmt.editQuestion') : t('courseMgmt.addQuestion')}</h4>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.questionText')}</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} className={inputClasses} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.questionType')}</label>
                <select value={type} onChange={e => setType(e.target.value as QuestionType)} className={inputClasses}>
                    <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                    <option value={QuestionType.TRUE_FALSE}>True/False</option>
                    <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                </select>
            </div>
            {type === QuestionType.MULTIPLE_CHOICE && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.questionOptions')}</label>
                    <textarea value={options} onChange={e => setOptions(e.target.value)} rows={4} className={inputClasses} required />
                </div>
            )}
             <div>
                <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.questionCorrectAnswer')}</label>
                {type === QuestionType.TRUE_FALSE ? (
                     <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className={inputClasses}>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                ) : (
                    <input type="text" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className={inputClasses} required />

                )}
                 <p className="mt-1 text-xs text-gray-500">{t('courseMgmt.questionCorrectAnswerHelp')}</p>
            </div>
            <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.save')}</button>
            </div>
        </form>
    );
};


const CourseManagementScreen: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { courses, exams, t, updateCourse, addModule, updateModule, deleteModule, addMaterial, updateMaterial, deleteMaterial, updateExam, addQuestionToModule, updateQuestionInModule, deleteQuestionFromModule } = useAppContext();

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
    const exam = useMemo(() => exams.find(e => e.id === course?.examId), [exams, course]);

    // Course state
    const [isEditingCourse, setIsEditingCourse] = useState(false);
    const [courseData, setCourseData] = useState<Partial<Course>>({});
    
    // Module state
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [moduleTitle, setModuleTitle] = useState('');
    const [isAddingModule, setIsAddingModule] = useState(false);
    
    // Material state
    const [editingMaterial, setEditingMaterial] = useState<{moduleId: string, materialId: string} | null>(null);
    const [materialData, setMaterialData] = useState<Partial<Material>>({});
    const [isAddingMaterial, setIsAddingMaterial] = useState<string | null>(null); // moduleId

    // Exam state
    const [examSettings, setExamSettings] = useState<Partial<Exam>>({});
    const [isEditingExam, setIsEditingExam] = useState(false);
    
    // Question State
    const [addingQuestionToModule, setAddingQuestionToModule] = useState<string|null>(null); // moduleId
    const [editingQuestion, setEditingQuestion] = useState<{moduleId: string, question: Question}|null>(null);

    useEffect(() => {
        if(exam) {
            setExamSettings({
                isLocked: exam.isLocked,
                randomizeQuestions: exam.randomizeQuestions,
                timeLimit: exam.timeLimit,
                numberOfQuestions: exam.numberOfQuestions,
            });
        }
    }, [exam]);

    if (!course) {
        return <Navigate to="/admin" />;
    }

    // Handlers for Course Details
    const handleEditCourse = () => {
        setCourseData({ title: course.title, description: course.description, imageUrl: course.imageUrl });
        setIsEditingCourse(true);
    };
    const handleSaveCourse = (e: React.FormEvent) => {
        e.preventDefault();
        updateCourse(course.id, courseData);
        setIsEditingCourse(false);
    };

    // Handlers for Modules
    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();
        addModule(course.id, { title: moduleTitle });
        setModuleTitle('');
        setIsAddingModule(false);
    };
    const handleEditModule = (module: Module) => {
        setEditingModuleId(module.id);
        setModuleTitle(module.title);
    };
    const handleSaveModule = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingModuleId) {
            updateModule(course.id, editingModuleId, { title: moduleTitle });
        }
        setEditingModuleId(null);
        setModuleTitle('');
    };
    const handleDeleteModule = (moduleId: string) => {
        if(window.confirm(t('confirm.delete.module'))) {
            deleteModule(course.id, moduleId);
        }
    };

    // Handlers for Materials
    const handleAddMaterial = (e: React.FormEvent, moduleId: string) => {
        e.preventDefault();
        addMaterial(course.id, moduleId, materialData as Omit<Material, 'id'>);
        setIsAddingMaterial(null);
        setMaterialData({});
    }
    const handleEditMaterial = (module: Module, material: Material) => {
        setEditingMaterial({moduleId: module.id, materialId: material.id});
        setMaterialData({title: material.title, type: material.type, url: material.url});
    }
    const handleSaveMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        if(editingMaterial) {
            updateMaterial(course.id, editingMaterial.moduleId, editingMaterial.materialId, materialData);
        }
        setEditingMaterial(null);
        setMaterialData({});
    }
    const handleDeleteMaterial = (moduleId: string, materialId: string) => {
        if(window.confirm(t('confirm.delete.material'))) {
            deleteMaterial(course.id, moduleId, materialId);
        }
    }

    // Handlers for Exam
    const handleSaveExamSettings = (e: React.FormEvent) => {
        e.preventDefault();
        if (exam) {
            updateExam(exam.id, examSettings);
            setIsEditingExam(false);
        }
    }


    const renderSection = (children: React.ReactNode) => (
        <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
    );
    
    const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const mtInputClasses = `mt-1 ${inputClasses}`;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <Link to="/admin" className="text-primary hover:underline">&larr; {t('admin.tabs.courses')}</Link>
             <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('courseMgmt.title')}: {course.title}</h1>

            {/* Course Details Section */}
            {renderSection(<>
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('courseMgmt.editCourse')}</h2>
                    {!isEditingCourse && <button onClick={handleEditCourse} className="font-medium text-primary hover:text-primary-700">{t('courseMgmt.action.edit')}</button>}
                </div>
                {isEditingCourse ? (
                    <form onSubmit={handleSaveCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseTitle')}</label>
                            <input type="text" value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} className={mtInputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseDescription')}</label>
                            <textarea value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} className={mtInputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseImageUrl')}</label>
                            <input type="text" value={courseData.imageUrl} onChange={e => setCourseData({...courseData, imageUrl: e.target.value})} className={mtInputClasses} />
                        </div>
                        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                            <button type="button" onClick={() => setIsEditingCourse(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                            <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.save')}</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.courseTitle')}:</span> {course.title}</p>
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.courseDescription')}:</span> {course.description}</p>
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.courseImageUrl')}:</span> <span className="text-sm text-gray-500 break-all">{course.imageUrl}</span></p>
                    </div>
                )}
            </>)}

            {/* Modules Section */}
             {renderSection(<>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{t('courseMgmt.modulesTitle')}</h2>
                    <button onClick={() => setIsAddingModule(!isAddingModule)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600">
                       {isAddingModule ? t('courseMgmt.cancel') : t('courseMgmt.addModule')}
                    </button>
                </div>

                {isAddingModule && (
                    <form onSubmit={handleAddModule} className="p-4 mb-4 bg-gray-50 rounded-md space-y-3">
                        <input type="text" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} placeholder={t('courseMgmt.moduleTitle')} className={inputClasses} required />
                        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                             <button type="button" onClick={() => setIsAddingModule(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                            <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.addModule')}</button>
                        </div>
                    </form>
                )}

                <div className="space-y-4">
                    {course.modules.map(module => (
                        <div key={module.id} className="p-4 border border-gray-200 rounded-lg">
                            {editingModuleId === module.id ? (
                                 <form onSubmit={handleSaveModule} className="space-y-3">
                                    <input type="text" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} className={inputClasses} required />
                                     <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                                        <button type="button" onClick={() => setEditingModuleId(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                                        <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.save')}</button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-700">{module.title}</h3>
                                        <div className="space-x-4 rtl:space-x-reverse">
                                            <button onClick={() => handleEditModule(module)} className="font-medium text-primary hover:text-primary-700">{t('courseMgmt.action.edit')}</button>
                                            <button onClick={() => handleDeleteModule(module.id)} className="font-medium text-danger hover:text-red-900">{t('courseMgmt.action.delete')}</button>
                                        </div>
                                    </div>
                                    
                                    {/* Materials Section */}
                                    <div className="mt-4 ps-4 border-s-2 border-gray-100">
                                        <h4 className="font-semibold text-gray-600">{t('courseMgmt.materialsTitle')}</h4>
                                        <div className="mt-2 space-y-3">
                                             {module.materials.map(material => (
                                                 <div key={material.id}>
                                                     {editingMaterial?.materialId === material.id ? (
                                                         <form onSubmit={handleSaveMaterial} className="p-3 bg-gray-50 rounded-md space-y-3">
                                                            <input type="text" value={materialData.title} onChange={e => setMaterialData({...materialData, title: e.target.value})} placeholder={t('courseMgmt.materialTitle')} className={inputClasses} />
                                                            <select value={materialData.type} onChange={e => setMaterialData({...materialData, type: e.target.value as 'VIDEO' | 'PDF'})} className={inputClasses}>
                                                                <option value="VIDEO">{t('courseMgmt.type.video')}</option>
                                                                <option value="PDF">{t('courseMgmt.type.pdf')}</option>
                                                            </select>
                                                            <input type="text" value={materialData.url} onChange={e => setMaterialData({...materialData, url: e.target.value})} placeholder={t('courseMgmt.materialUrl')} className={inputClasses} />
                                                            <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                                                                <button type="button" onClick={() => setEditingMaterial(null)} className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                                                                <button type="submit" className="px-3 py-1 text-sm bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.save')}</button>
                                                            </div>
                                                         </form>
                                                     ) : (
                                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                                            <span className="truncate" title={material.title}>{material.title} <span className="text-xs text-gray-500 uppercase">({material.type})</span></span>
                                                            <div className="space-x-3 rtl:space-x-reverse flex-shrink-0">
                                                                <button onClick={() => handleEditMaterial(module, material)} className="text-sm font-medium text-primary hover:text-primary-700">{t('courseMgmt.action.edit')}</button>
                                                                <button onClick={() => handleDeleteMaterial(module.id, material.id)} className="text-sm font-medium text-danger hover:text-red-900">{t('courseMgmt.action.delete')}</button>
                                                            </div>
                                                        </div>
                                                     )}
                                                 </div>
                                             ))}
                                            {isAddingMaterial === module.id ? (
                                                 <form onSubmit={e => handleAddMaterial(e, module.id)} className="p-3 bg-blue-50 rounded-md space-y-3">
                                                    <input type="text" value={materialData.title || ''} onChange={e => setMaterialData({...materialData, title: e.target.value})} placeholder={t('courseMgmt.materialTitle')} className={inputClasses} required/>
                                                    <select defaultValue="VIDEO" value={materialData.type} onChange={e => setMaterialData({...materialData, type: e.target.value as 'VIDEO' | 'PDF'})} className={inputClasses} required>
                                                        <option value="VIDEO">{t('courseMgmt.type.video')}</option>
                                                        <option value="PDF">{t('courseMgmt.type.pdf')}</option>
                                                    </select>
                                                    <input type="text" value={materialData.url || ''} onChange={e => setMaterialData({...materialData, url: e.target.value})} placeholder={t('courseMgmt.materialUrl')} className={inputClasses} required/>
                                                    <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                                                        <button type="button" onClick={() => setIsAddingMaterial(null)} className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                                                        <button type="submit" className="px-3 py-1 text-sm bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.addMaterial')}</button>
                                                    </div>
                                                 </form>
                                            ) : (
                                                <button onClick={() => { setMaterialData({type: "VIDEO"}); setIsAddingMaterial(module.id); }} className="mt-2 text-sm text-primary hover:underline">{t('courseMgmt.addMaterial')}</button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Question Bank Section */}
                                    <div className="mt-4 ps-4 border-s-2 border-gray-100">
                                        <h4 className="font-semibold text-gray-600">{t('courseMgmt.moduleQuestionBank')} ({module.questions.length})</h4>
                                        <div className="mt-2 space-y-3">
                                             {module.questions.map(q => (
                                                 <div key={q.id}>
                                                     {editingQuestion?.question.id === q.id ? (
                                                        <QuestionForm 
                                                            question={q}
                                                            onSave={(data) => {
                                                                updateQuestionInModule(course.id, module.id, q.id, data);
                                                                setEditingQuestion(null);
                                                            }}
                                                            onCancel={() => setEditingQuestion(null)}
                                                        />
                                                     ) : (
                                                        <div className="p-3 border rounded-md flex justify-between items-start">
                                                            <p className="text-sm text-gray-800 break-words w-full me-4">{q.text}</p>
                                                            <div className="flex-shrink-0 space-x-3 rtl:space-x-reverse">
                                                                <button onClick={() => { setEditingQuestion({moduleId: module.id, question: q}); setAddingQuestionToModule(null); }} className="text-sm font-medium text-primary hover:text-primary-700">{t('courseMgmt.action.edit')}</button>
                                                                <button onClick={() => deleteQuestionFromModule(course.id, module.id, q.id)} className="text-sm font-medium text-danger hover:text-red-900">{t('courseMgmt.action.delete')}</button>
                                                            </div>
                                                        </div>
                                                     )}
                                                 </div>
                                             ))}
                                            {addingQuestionToModule === module.id ? (
                                                <QuestionForm 
                                                    onSave={(data) => {
                                                        addQuestionToModule(course.id, module.id, data as Omit<Question, 'id'>);
                                                        setAddingQuestionToModule(null);
                                                    }}
                                                    onCancel={() => setAddingQuestionToModule(null)}
                                                />
                                            ) : (
                                                <button onClick={() => { setAddingQuestionToModule(module.id); setEditingQuestion(null); }} className="mt-2 text-sm text-primary hover:underline">{t('courseMgmt.addQuestion')}</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </>)}

             {/* Exam Management Section */}
            {exam && renderSection(<>
                 <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{t('courseMgmt.examManagement')}</h2>
                     {!isEditingExam && <button onClick={() => setIsEditingExam(true)} className="font-medium text-primary hover:text-primary-700">{t('courseMgmt.action.edit')}</button>}
                </div>
                {/* Exam Settings Form */}
                {isEditingExam ? (
                    <form onSubmit={handleSaveExamSettings} className="p-4 mb-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                        <h3 className="text-lg font-semibold">{t('courseMgmt.examSettings')}</h3>
                         <div>
                            <label htmlFor="numberOfQuestions" className="text-sm font-medium text-gray-700">{t('courseMgmt.numberOfQuestions')}</label>
                            <input type="number" id="numberOfQuestions" value={examSettings.numberOfQuestions || 0} onChange={e => setExamSettings({...examSettings, numberOfQuestions: parseInt(e.target.value)})} className={mtInputClasses} min="0" />
                             <p className="mt-1 text-xs text-gray-500">{t('courseMgmt.numberOfQuestionsHelp')}</p>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="isLocked" checked={examSettings.isLocked || false} onChange={e => setExamSettings({...examSettings, isLocked: e.target.checked})} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                            <label htmlFor="isLocked" className="ms-2 text-sm font-medium text-gray-700">{t('courseMgmt.examLock')}</label>
                        </div>
                         <div className="flex items-center">
                            <input type="checkbox" id="randomize" checked={examSettings.randomizeQuestions || false} onChange={e => setExamSettings({...examSettings, randomizeQuestions: e.target.checked})} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                            <label htmlFor="randomize" className="ms-2 text-sm font-medium text-gray-700">{t('courseMgmt.examRandomize')}</label>
                        </div>
                        <div>
                            <label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">{t('courseMgmt.examTimeLimit')}</label>
                            <input type="number" id="timeLimit" value={examSettings.timeLimit || 0} onChange={e => setExamSettings({...examSettings, timeLimit: parseInt(e.target.value)})} className={mtInputClasses} min="0"/>
                             <p className="mt-1 text-xs text-gray-500">{t('courseMgmt.examTimeLimitHelp')}</p>
                        </div>
                        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                            <button type="button" onClick={() => setIsEditingExam(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                            <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('courseMgmt.save')}</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2 text-gray-700 p-4 mb-4 bg-gray-50 rounded-md">
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.numberOfQuestions')}:</span> {exam.numberOfQuestions}</p>
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.examLock')}:</span> {exam.isLocked ? t('exam.true') : t('exam.false')}</p>
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.examRandomize')}:</span> {exam.randomizeQuestions ? t('exam.true') : t('exam.false')}</p>
                        <p><span className="font-semibold text-gray-600">{t('courseMgmt.examTimeLimit')}:</span> {exam.timeLimit > 0 ? `${exam.timeLimit} ${t('courseMgmt.examTimeLimit').split(' ')[1]}` : 'No limit'}</p>
                    </div>
                )}
            </>)}
        </div>
    );
};

export default CourseManagementScreen;