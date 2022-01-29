import React, { useEffect, useState } from 'react';
import { Box, Text, Image } from '@skynexui/components';
import appConfig from '../../config.json';

export function Popover(props) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`https://api.github.com/users/${props.message.from}`).then(async (res) => {
      let resp = await res.json();
      if (resp.name) {
        setUserData(resp);
      }
      console.log(userData);
    });
  }, [props]);

  return (
    <>
      <style global jsx>{`
              .popover__wrapper:hover .popover__content {
                  z-index: 1000;
                  opacity: 1;
                  visibility: visible;
                  transform: translate(0, -20px);
                  transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
              }
          `}</style>

      <Box
        tag="div"
        className='popover__wrapper'
        styleSheet={{
          position: 'absolute',
          display: 'inline-block',
        }}
      >
        <Text
          tag="a"
          styleSheet={{
            textDecoration: 'none',
            cursor: 'zoom-in',
          }}>
          <Text
            as="h2"
            className="popover__title"
            styleSheet={{
              fontSize: '24px',
              lineHeight: '36px',
              textDecoration: 'none',
              textAlign: 'center',
              padding: '15px 0',
            }}
          >{props.children}</Text>
        </Text>
        <Box
          tag="div"
          className="popover__content"
          styleSheet={{
            opacity: 0,
            visibility: 'hidden',
            position: 'absolute',
            left: '0',
            transform: 'translate(0, 10px)',
            backgroundColor: appConfig.theme.colors.primary[300],
            padding: '1.5rem',
            boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
            width: 'auto',
            before: {
              position: 'absolute',
              zIndex: '-1',
              content: "",
              right: 'calc(50% - 10px)',
              top: '-8px',
              borderStyle: 'solid',
              borderWidth: '0 10px 10px 10px',
              borderColor: 'transparent transparent #bfbfbf transparent',
              transitionDuration: '0.3s',
              transitionProperty: 'transform',
            },

          }}
        >
          <Image
            styleSheet={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px',
            }}
            alt=""
            src={`https://github.com/${props.message.from}.png`}
          />
          <Text
            tag="span"
            className="popover__message"
            styleSheet={{
              textAlign: 'center',
            }}
          >{props.message.from}</Text>
          {!!Object.keys(userData).length && (<Text
            tag="span"
            styleSheet={{
              textAlign: 'center',
              display: 'block',
            }}
          >{userData.name}<br />Following:{userData.following}
          </Text>
          )}
        </Box>
      </Box>
    </>
  );
}