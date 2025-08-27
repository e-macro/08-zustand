'use client'
import css from './NoteForm.module.css';
// import {Formik, Form, ErrorMessage, Field} from 'formik';
// import * as Yup from 'yup';
import {createNote, type CreateNoteParams } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';


export default function NoteForm() {
  const router = useRouter();
  const {draft,setDraft,clearDraft} = useNoteDraftStore();
    const client = useQueryClient();
    const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
    const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft()
      client.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
  })
    const createNewNote = (formData: FormData) => {
      const newNote: CreateNoteParams = {
        title: String(formData.get('title') ?? ''),
        content: String(formData.get('content') ?? ''),
        tag: String(formData.get('tag')) as CreateNoteParams['tag'],
      };
    createNoteMutation.mutate(newNote);
}
    // const NoteValidation = Yup.object().shape({
    //     title: Yup.string()
    //     .required('Title is required')
    //     .min(3, 'Title must be at least 3 characters long')
    //     .max(50, 'Title must not exceed 50 characters'),
    //     content: Yup.string()
    //     .max(500, 'Content text is too long'),
    //     tag: Yup.string()
    //     .oneOf(['Todo', 'Work', "Personal", 'Meeting', 'Shopping'], 'Tag is invalid')
    //     .required('Tag is required'),
    // })
    return (
        <form className={css.form} action={createNewNote}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" name="title" className={css.input}
              defaultValue={draft?.title} onChange={handleChange}/>
              {/* <ErrorMessage component="span" name="title" className={css.error} /> */}
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
                defaultValue={draft?.content}
                onChange={handleChange}
                required
              />
              {/* <ErrorMessage component="span" name="content" className={css.error} /> */}
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <select id="tag" name="tag" className={css.select} onChange={handleChange} defaultValue={draft?.tag} required>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </select>
             {/* <ErrorMessage component="span" name="tag" className={css.error} /> */}
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={() => router.push('/notes/filter/All')}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={false}
              >
                Create note
              </button>
            </div>
        </form>
    )
}