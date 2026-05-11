export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#F8F9F5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    }}>
      <img
        src="/school-logo.png"
        alt="Aroyan Logo"
        style={{
          width: 80,
          height: 80,
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          objectFit: 'contain',
          marginBottom: 16,
          animation: 'logoPulse 1.5s ease-in-out infinite',
        }}
      />
      <h2 style={{
        color: '#2D5F3F',
        fontSize: 20,
        fontWeight: 700,
        margin: 0,
      }}>Aroyan Muslim School</h2>
      <div style={{
        marginTop: 14,
        width: 40,
        height: 40,
        border: '3px solid rgba(45, 95, 63, 0.15)',
        borderTopColor: '#2D5F3F',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
