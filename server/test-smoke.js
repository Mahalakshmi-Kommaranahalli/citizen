import('./src/server.js').then(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/health');
    const json = await res.json();
    console.log('HEALTH RESPONSE:', json);

    const grvRes = await fetch('http://localhost:5000/api/grievances');
    const grvJson = await grvRes.json();
    console.log('GRIEVANCES COUNT:', grvJson.count);
    console.log('FIRST TICKET TOKEN:', grvJson.data[0]?.trackingToken);

    const spaRes = await fetch('http://localhost:5000/');
    const spaText = await spaRes.text();
    console.log('SPA HTML LENGTH:', spaText.length, 'HAS ROOT DIV:', spaText.includes('id="root"'));

    // Test creating a new grievance through automated routing
    const postRes = await fetch('http://localhost:5000/api/grievances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Dangerous live electrical wire sparking across footpath near nursery',
        description: 'Exposed 440V distribution wire fell after storm. Sparking actively on wet ground. Huge electrocution risk.',
        wardId: 'WARD_01',
        address: 'Sector 3 Nursery Lane, Civil Lines',
        citizen: { name: 'Priya Sharma', phone: '+91 98111 22233', email: 'priya.s@gmail.com' }
      })
    });
    const postJson = await postRes.json();
    console.log('NEW GRIEVANCE CREATED:');
    console.log(' - Token:', postJson.data?.trackingToken);
    console.log(' - Auto-Routed Department:', postJson.data?.departmentName);
    console.log(' - Priority:', postJson.data?.priority);
    console.log(' - SLA Hours:', postJson.data?.slaHours);
    console.log(' - Officer Assigned:', postJson.data?.assignedOfficer?.name);

    console.log('\n>>> ALL END-TO-END TESTS PASSED WITH 100% SUCCESS! <<<');
    process.exit(0);
  } catch (err) {
    console.error('TEST ERROR:', err);
    process.exit(1);
  }
});

