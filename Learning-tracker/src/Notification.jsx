const Notification = ({notify}) => {
    const style = {
        borderRadius: '8px',
        margin: '16px 8px',
        padding: '16px 12px',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#fff',
        background: notify.type === 'success' ? '#27ae60' : '#c0392b',
        border: notify.type === 'success' ? '3px solid #2ecc71' : '3px solid #e74c3c',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }

    return(<div style={style}>{notify.mes}</div>)
}

export default Notification