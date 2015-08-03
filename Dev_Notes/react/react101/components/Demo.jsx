var Demo = ReactJS.createClass({
  render: function () {
    return(
      <div className='container'>
        <h1>React.js Componenet</h1>
        <form>
          <p className='h3'>How did you hear about us?</p>
          <p className='radio'>
            <label>
              <input type='radio' name='referrer' value='newspaper'/>
              Newspaper
            </label>
          </p>
          <p className='radio'>
            <label>
              <input type='radio' name='referrer' value='radio'/>
              Radio
            </label>
          </p>
          <p className='radio'>
            <label>
              <input type='radio' name='referrer' value='Search Engine'/>
              Search Engine
            </label>
          </p>
          <p className='radio'>
            <label>
              <input type='radio' name='referrer' value='social media'/>
              Social Media
            </label>
          </p>
          <p className='form-group radio'>
            <label>
              <input type='radio' name='referrer' value='other'/>
              
            </label>
            <label className='form-inline'>
              Please Specify:
              <input type='radio' name='referrer' value='referrer-other'/>
            </label>
          </p>
          <p><input type='submit'/></p>
        </form>
      </div>
    );
  }
});
