const carfinder = require('./carfinder-node');
const bucket = 'amyj-mrhq' // the bucketname without s3://
const photo  = '2020-lamborghini-huracan-evo-Autocar-6.jpg' // the name of file

const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    },
  },
  MaxLabels: 10
}

test('result should be coupe', () => {
  expect(carfinder(params)).resolves.toBe('Coupe');
});

