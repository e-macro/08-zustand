import css from './NoteForm.module.css';
import {Formik, Form, ErrorMessage, Field} from 'formik';
import * as Yup from 'yup';
import {createNote, type CreateNoteParams } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface NoteFormProps {
    onClose: () => void;
}

export default function NoteForm({onClose}: NoteFormProps) {
    const client = useQueryClient();
    const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  })
    const createNewNote = (newNote: CreateNoteParams) => {
    createNoteMutation.mutate(newNote);
}
    const NoteValidation = Yup.object().shape({
        title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters long')
        .max(50, 'Title must not exceed 50 characters'),
        content: Yup.string()
        .max(500, 'Content text is too long'),
        tag: Yup.string()
        .oneOf(['Todo', 'Work', "Personal", 'Meeting', 'Shopping'], 'Tag is invalid')
        .required('Tag is required'),
    })
    return (
    <Formik initialValues={{
        title: '',
        content: '',
        tag: 'Todo',
    }} validationSchema={NoteValidation} onSubmit={createNewNote}>
        <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" type="text" name="title" className={css.input} />
              <ErrorMessage component="span" name="title" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage component="span" name="content" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
             <ErrorMessage component="span" name="tag" className={css.error} />
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={onClose}>
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
        </Form>
    </Formik>
)

}