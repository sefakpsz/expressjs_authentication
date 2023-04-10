import { Model, Schema } from 'mongoose'

const visibilityTypes = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

exports.module = new Model(`VisibilityTypes`, visibilityTypes)