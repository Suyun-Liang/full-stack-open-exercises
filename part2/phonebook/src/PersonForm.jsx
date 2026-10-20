function PersonForm({
  onSubmit,
  nameVal,
  numberVal,
  onChangeName,
  onChangeNumber,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">name:</label>
        <input id="name" value={nameVal} onChange={onChangeName} />
      </div>
      <div>
        <label htmlFor="number">number:</label>
        <input id="number" value={numberVal} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm;
