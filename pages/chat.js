import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

export default function ChatPage() {
    const [message, setMessage] = React.useState('');
    const [messagesList, setMessagesList] = React.useState([]);
    const [enterSends, setEnterSend] = React.useState(true);

    const sendMessage = ((newMessage) => {
        if (newMessage.length) {
            const _message = {
                from: 'daihensel',
                text: newMessage,
                id: messagesList.length
            }
            setMessagesList([_message, ...messagesList]);
            setMessage('');
        }
    });

    const deleteMessage = ((messageId) => {
        const _messagesList = messagesList.filter(message => message.id != messageId);
        setMessagesList([..._messagesList]);
    });

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://wallpaper.dog/large/514209.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.primary['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.primary[100],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.primary[700],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                        justifyContent: 'flex-end',
                    }}
                >

                    <MessageList messages={messagesList} deleteMessage={(messageId) => deleteMessage(messageId)} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignContent: 'flex-end',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => { setMessage(event.target.value) }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter' && enterSends) {
                                    event.preventDefault();
                                    sendMessage(message);
                                }
                            }}
                            placeholder="Your message here..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.primary[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.primary[200],
                            }}
                        />
                        <Button
                            styleSheet={{
                                height: '43px',
                                borderRadius: '5px',
                                backgroundColor: appConfig.theme.colors.primary[300],
                                color: appConfig.theme.colors.primary[200],
                            }}
                            disabled={!message.length}
                            label='OK'
                            onClick={() => sendMessage(message)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const handleDelete = ((messageId) => {
        if (props.deleteMessage) props.deleteMessage(messageId);
    });

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.primary["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.primary[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div className="info">
                                <Image
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                    }}
                                    alt=""
                                    src={`https://github.com/${message.from}.png`}
                                />
                                <Text tag="strong">
                                    {message.from}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.primary[300],
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </div>
                            <div>
                                <Button
                                    styleSheet={{
                                        backgroundColor: 'transparent',
                                        focus: {
                                            backgroundColor: '',
                                        },
                                        hover: {
                                            backgroundColor: '',
                                        }
                                    }}
                                    iconName="trash"
                                    size="xs"
                                    onClick={() => handleDelete(message.id)}
                                />
                            </div>
                        </Box>
                        {message.text}
                    </Text>
                );
            })}
        </Box>
    )
}