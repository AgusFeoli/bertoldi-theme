const parseValue = val => {
    const curr = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    });
    return curr.format(val).split(',')[0]
}

export default parseValue;