import { init } from '@rematch/core'

const dragStatus = {
    state: {
        inside: false,
    },
    reducers: {
        setInside(state, payload) {
            return {
                ...state,
                inside: payload
            }
        }
    }
}

const store = init({
    dragStatus
});

export default store;
