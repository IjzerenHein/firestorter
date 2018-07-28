<template>
    <div>
        <b-form-checkbox
            id="checkbox1"
            v-model="status"
            value=true
            unchecked-value=false />
        <b-form-input
            v-model="text1"
            type="text"
            placeholder="Enter your name" />
        <b-button
            size="sm"
            variant="danger"
            @click="state.setAge">
            Delete
        </b-button>
    </div>
</template>

<script>
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Observer } from "mobx-vue";

    @Observer
    @Component
    export default class App extends Vue {
        state = new ViewModel()
        mounted() {
            this.state.fetchUsers();
        }

        onPressDelete = async () => {
            const {todo} = this.props;
            if (this._deleting) return;
            this._deleting = true;
            try {
                await todo.delete();
                this._deleting = false;
            }
            catch (err) {
                this._deleting = false;
            }
        };

        onPressCheck = async () => {
            const {todo} = this.props;
            await todo.update({
                finished: !todo.data.finished
            });
        };

        onTextChange = async (event, newValue) => {
            const {todo} = this.props;
            await todo.update({
                text: newValue
            });
        };
    }
</script>
