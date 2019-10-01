class FSM {
     /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (arguments[0]){
            for (let key in config){
                if (config.hasOwnProperty(key)) this[key] = config[key];
            }
            this.undoBuffer = [];
            this.redoBuffer = [];
            this.undoBuffer.push(this.initial);
            this._defaultState = this.initial;
        }else throw new Error("config isn't passed");
    }
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this.redoBuffer = [];
        this.undoBuffer.push(this.getState());
        if(this.states.hasOwnProperty(state)) this.initial = state;
        else throw new Error('state is not defined');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let current = this.getState();
        if(this.states[current].transitions.hasOwnProperty(event)){
            this.redoBuffer = [];
            this.undoBuffer.push(this.initial);
            this.initial = this.states[current].transitions[event];
        }
        else throw new Error('error');
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.initial = this._defaultState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesBuffer = [];
        if(arguments[0]){
            for (let key in this.states){
                if(this.states[key].transitions.hasOwnProperty(event)) statesBuffer.push(key);
            }
        }else {
            for (let key in this.states){
                if(this.states[key]) statesBuffer.push(key);
            }
        }
        
        return statesBuffer;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.undoBuffer.length) return false;
        if (this.undoBuffer.length === 1) return false;
        else {
            this.redoBuffer.push(this.initial);
            this.initial = this.undoBuffer.pop();
        }
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.redoBuffer.length) return false;
        else {
            this.initial = this.redoBuffer.pop();
            this.undoBuffer.push(this.initial);
        }
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.initial = this._defaultState;
        this.redoBuffer = [];
        this.undoBuffer = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
