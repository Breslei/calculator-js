class CalcController {

    constructor(){
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastOperator = ''
        this._lastNumber = ''
        this._operation = []
        this._locale="pt-BR"
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate
        this.initialize()
        this.initButtonsEvents()
        this.initKeyboard()
    }

    initialize(){

        this.setDisplayDateTime()//inicializa a hora e a data
      
        setInterval(()=>{//atualiza a hora e a data
            this.setDisplayDateTime()
        },1000)

        this.setLastNumberToDisplay()
        this.pasteFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()
            })
        })

    }


    toggleAudio(){//verificando se o estado esta ligado ou desligado
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){// tocando o som
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    //                   btn     onclick fn=function
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event=>{ //usando split para separar os espaços e receber apenas as strings(nomes dos eventos)
            element.addEventListener(event, fn, false)
        })
    }


    //metodos da calculadora
    clearAll(){//"limpa a tela"
        this._operation = []
        this._lastOperator = ''
        this._lastNumber = ''
        this.setLastNumberToDisplay()
    }

    clearEntry(){//remove apenas o último item
        this._operation.pop()

        this.setLastNumberToDisplay()
    }

    setError(){
         this.displayCalc = "Error"
    }


    getLastOperation(){
       return this._operation[this._operation.length - 1] // retorna o último item para ver se é um número ou operador 
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }


    isOperator(value){//verificando se os operadores estão ali dentro
        return (['+', '-', '*', '%','/'].indexOf(value) > -1)

    }

    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3){
            this.calc()
        }
    }

    getResult(){
        try {
            return  eval(this._operation.join(""))
        } catch (error) {
            setTimeout(()=>{
                this.setError()
            }, 1)
        }
      
    }

    calc(){

        let last = ''

        this._lastOperator=this.getLastItem(true)

        if(this._operation.length < 3){

            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]

        }

      if(this._operation.length > 3){
        last = this._operation.pop()

        this._lastNumber = this.getResult()
      }


      else if(this._operation.length == 3){

        this._lastNumber = this.getLastItem(false)
      }


      let result = this.getResult()

      if(last =='%'){

        result = result/100
        this._operation = [result]

      }else{

          this._operation = [result]
          if(last) this._operation.push(last)

      }

      this.setLastNumberToDisplay()

    }

    getLastItem(isOperator = true){


        let lastItem
        for(let i=this._operation.length-1; i>=0; i--){

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i]
                    break
                }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator: this._lastNumber
        }

        return lastItem

    }

    setLastNumberToDisplay(){//atualiza display
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }




    addOperation(value){

        if(isNaN(this.getLastOperation())){ // se não for um número

            if(this.isOperator(value)){

                this.setLastOperation(value)

            }else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }

        }else{// se for um número

            if(this.isOperator(value)){
                this.pushOperation(value)
           
            }else{
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)

                this.setLastNumberToDisplay()
            }
        }
        
    }


    addDot(){

        let lastOperation = this.getLastOperation()

        if(typeof lastOperation == 'string' && lastOperation.split('').indexOf('.') > -1) return

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperator('0.')
        }else{
            this.setLastOperation(lastOperation.toString()+'.')
        }

        this.setLastNumberToDisplay()
    }


    initKeyboard(){
        document.addEventListener('keyup',e=>{

            this.playAudio()

            switch(e.key){
                case "Escape":
                    this.clearAll()
                    break
    
                case "Backspace":
                    this.clearEntry()
                    break
    
                case "+":                    
                case "-":    
                case "/":    
                case "*":    
                case "%":
                    this.addOperation(e.key)
                    break

                case "Enter":
                case "=":
                    this.calc()
                    break
    
                case ".":
                case ",":
                    this.addDot()
                    break
    
                //como os numeros serão tratados da mesma forma, podemos colocar um case em baixo do outro
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key))
                    break
    
            }
        })

    }

    copyToClipboard(){
       let input = document.createElement('input') 
       input.value = this.displayCalc
       document.body.appendChild(input)

       input.select()//função nativa do JS

       document.execCommand("Copy")//função nativa do JS

       input.remove()

    }

    pasteFromClipboard(){
        document.addEventListener('paste',e=>{
          let text =  e.clipboardData.getData('Text')
          
            this.displayCalc = parseFloat(text)
            
          console.log(text)
        })
    }

    //identificando o elemento que foi digitado
    execBtn(value){

        this.playAudio()

        switch(value){
            case "ac":
                this.clearAll()
                break

            case "ce":
                this.clearEntry()
                break

            case "soma":
                this.addOperation('+')
                break

            case "subtracao":
                this.addOperation('-')
                break

            case "divisao":
                this.addOperation('/')
                break

            case "multiplicacao":
                this.addOperation('*')
                break

            case "porcento":
                this.addOperation('%')
                break

            case "igual":
                this.calc()
                break

            case "ponto":
                this.addDot()
                break

            //como os numeros serão tratados da mesma forma, podemos colocar um case em baixo do outro
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value))
                break

            default:
                this.setError()
                break    

        }
    }


    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g , #parts > g") //seleciona todos os itens que tem g, tanto os botões quanto a área do texto

        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag",e=>{
                let textBtn= btn.className.baseVal.replace("btn-","")

                this.execBtn(textBtn)
            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer"
            })
        })
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day:"2-digit",
            month:"long",
            year:"numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get dislayTime(){
        return this._timeEl.innerHTML
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value){

        if(value.toString().length > 10 ){
            this.setError()
            return
        }

        this._displayCalcEl.innerHTML = value
    }

    get currentDate(){
        return new Date()
    }

    set currentDate(value){
        this._currentDate= value
    }

}